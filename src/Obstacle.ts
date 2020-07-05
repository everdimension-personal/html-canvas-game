import type { GameState } from "./app";
import type { Bird } from "./Bird";

class Obstacle {
  topHeight: number;
  bottomHeight: number;
  bottomY: number;
  width: number;
  x: number;
  color: string;
  didPass: boolean;

  constructor(ctx: CanvasRenderingContext2D, state: GameState) {
    const { canvas } = ctx;
    this.topHeight = (Math.random() * canvas.height) / 3 + 30;
    this.bottomHeight = (Math.random() * canvas.height) / 3 + 30;
    this.bottomY = canvas.height;
    this.width = 20;
    this.x = canvas.width;
    this.color = `hsl(${state.hue}, 100%, 50%)`;
    this.didPass = false;
  }

  update(state: GameState) {
    this.x -= state.gamespeed;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, 0, this.width, this.topHeight);
    ctx.fillRect(
      this.x,
      this.bottomY - this.bottomHeight,
      this.width,
      this.bottomHeight
    );
  }
}

export const obstacles: Obstacle[] = [];

export function updateObstacles(
  ctx: CanvasRenderingContext2D,
  state: GameState
) {
  if (state.frame % 50 === 0) {
    obstacles.unshift(new Obstacle(ctx, state));
  }
  obstacles.forEach((obstacle) => {
    obstacle.update(state);
    obstacle.draw(ctx);
  });
  if (obstacles.length > 20) {
    obstacles.pop();
  }
}

interface Bounds {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

function intersects(boundsA: Bounds, boundsB: Bounds): boolean {
  if (boundsA.left > boundsB.right) {
    return false;
  }
  if (boundsA.top > boundsB.bottom) {
    return false;
  }
  if (boundsA.right < boundsB.left) {
    return false;
  }
  if (boundsA.bottom < boundsB.top) {
    return false;
  }
  return true;
}

const boomImage = new Image();
// @ts-ignore require call
boomImage.src = require("./assets/boom.png");

export function handleCollision(
  ctx: CanvasRenderingContext2D,
  bird: Bird
): boolean {
  return obstacles.some((obstacle) => {
    const topObstacleBounds = {
      top: 0,
      bottom: obstacle.topHeight,
      left: obstacle.x,
      right: obstacle.x + obstacle.width,
    };
    const bottomObstacleBounds = {
      top: obstacle.bottomY - obstacle.bottomHeight,
      bottom: obstacle.bottomY,
      left: obstacle.x,
      right: obstacle.x + obstacle.width,
    };
    const birdBounds = {
      top: bird.y,
      bottom: bird.y + bird.height,
      left: bird.x,
      right: bird.x + bird.width,
    };
    if (
      intersects(birdBounds, topObstacleBounds) ||
      intersects(birdBounds, bottomObstacleBounds)
    ) {
      ctx.drawImage(
        boomImage,
        birdBounds.right - 10,
        birdBounds.top - 10,
        30,
        30
      );
      return true;
    }
  });
}

export function getNewlyPassedObstaclesCount(bird: Bird) {
  let count = 0;
  const birdLeftEdge = bird.x;
  obstacles
    .filter((obstacle) => !obstacle.didPass)
    .forEach((obstacle) => {
      const rightEdge = obstacle.x + obstacle.width;
      if (rightEdge < birdLeftEdge) {
        count++;
        obstacle.didPass = true;
      }
    });
  return count;
}

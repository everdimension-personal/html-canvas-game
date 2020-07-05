import "./app.css";
import { Bird } from "./Bird";
import { updateParticles } from "./Particle";
import {
  updateObstacles,
  handleCollision,
  getNewlyPassedObstaclesCount,
} from "./Obstacle";
import { handleGameOver } from "./game-over";
import { updateScore } from "./score";

console.log("hello");
const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d")!;
if (!ctx) {
  throw new Error("2D rendering context not found");
}
canvas.width = 600;
canvas.height = 400;

const gameState = {
  spacePressed: false,
  angle: 0,
  hue: 200,
  frame: 0,
  score: 0,
  gamespeed: 2,
  collisionFrame: 0,
  isGameOver: false,
  pause: false,
};
export type GameState = typeof gameState;

const bird = new Bird();
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  gameState.angle += 0.2;
  gameState.hue += 1;
  gameState.frame += 1;
  updateObstacles(ctx, gameState);
  bird.update(ctx, gameState);
  bird.draw(ctx);

  const newlyPassedObjects = getNewlyPassedObstaclesCount(bird);
  gameState.score += newlyPassedObjects;

  const collides = handleCollision(ctx, bird);
  if (collides) {
    gameState.collisionFrame = gameState.frame;
    gameState.isGameOver = true;
  }
  if (gameState.isGameOver) {
    handleGameOver(ctx, gameState);
    return;
  }
  updateScore(ctx, gameState);
  updateParticles(ctx, gameState, bird);
  if (gameState.pause) {
    return;
  }
  requestAnimationFrame(animate);
}

animate();

window.addEventListener("keydown", (event) => {
  if (event.code === "Space") {
    if (gameState.isGameOver) {
      gameState.isGameOver = false;
      animate();
    }
    gameState.spacePressed = true;
  }
  if (event.key === "p") {
    // pause
    gameState.pause = !gameState.pause;
    if (!gameState.pause) {
      // resume
      animate();
    }
  }
});
window.addEventListener("keyup", (event) => {
  if (event.code === "Space") {
    gameState.spacePressed = false;
  }
});

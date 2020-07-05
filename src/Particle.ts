import type { Bird } from "./Bird";
import type { GameState } from "./app";

export class Particle {
  x: number;
  y: number;
  size: number;
  speedY: number;
  color: string;

  constructor(bird: Bird, state: GameState) {
    this.x = bird.x;
    this.y = bird.y;
    this.size = Math.random() * 7 + 3;
    this.speedY = Math.random() - 0.5;
    this.color = `hsla(${state.hue}, 100%, 50%, 0.8)`;
  }

  update(state: GameState) {
    this.x -= state.gamespeed;
    this.y += this.speedY;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

const particles: Particle[] = [];

export function updateParticles(
  ctx: CanvasRenderingContext2D,
  state: GameState,
  bird: Bird
) {
  const recentCollision =
    state.collisionFrame !== 0 && state.frame - state.collisionFrame < 30;
  if (!recentCollision) {
    particles.unshift(new Particle(bird, state));
  }
  for (let i = 0; i < particles.length; i++) {
    particles[i].update(state);
    particles[i].draw(ctx);
  }
  if (particles.length > 200) {
    particles.length = particles.length - 20;
  }
}

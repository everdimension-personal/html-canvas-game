import type { GameState } from "./app";

export class Bird {
  x: number;
  y: number;
  vy: number;
  width: number;
  height: number;
  weight: number;

  constructor() {
    this.x = 150;
    this.y = 200;
    this.vy = 0;
    this.width = 20;
    this.height = 20;
    this.weight = 1;
  }
  update(ctx: CanvasRenderingContext2D, state: GameState) {
    const { canvas } = ctx;
    const curve = Math.sin(state.angle) * 20;
    const padding = this.height * 3;
    if (this.y + padding + curve > canvas.height) {
      this.y = canvas.height - padding - curve;
      this.vy = 0;
    } else if (this.y < 0) {
      this.y = 0;
      this.vy = 0;
    } else {
      this.vy += this.weight;
      this.vy *= 0.9;
      this.y += this.vy;
    }
    if (state.spacePressed && this.y > padding) {
      this.flap();
    }
  }
  flap() {
    this.vy -= 2;
  }
  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = "#f06";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

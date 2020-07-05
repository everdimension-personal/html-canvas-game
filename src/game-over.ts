import { GameState } from "./app";

export function handleGameOver(
  ctx: CanvasRenderingContext2D,
  state: GameState
) {
  ctx.fillStyle = "#222";
  ctx.font = "48px Helvetica";
  const text = `Game Over. Score: ${state.score}`;
  const textMetrics = ctx.measureText(text);
  ctx.fillText(text, ctx.canvas.width / 2 - textMetrics.width / 2, 100);
}

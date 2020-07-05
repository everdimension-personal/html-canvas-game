import { GameState } from "./app";

export function updateScore(ctx: CanvasRenderingContext2D, state: GameState) {
  ctx.fillStyle = "#333";
  ctx.font = "48px Helvetica";
  const text = String(state.score);
  const textMetrics = ctx.measureText(text);
  const rightPadding = 15;
  const topPadding = 45;
  ctx.fillText(
    text,
    ctx.canvas.width - textMetrics.width - rightPadding,
    topPadding
  );
}

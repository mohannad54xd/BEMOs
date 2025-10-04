// Lightweight Fresnel-like gradient helper for canvas rendering
export function drawFresnelHighlight(ctx: CanvasRenderingContext2D, cx: number, cy: number, radius: number) {
	const grad = ctx.createRadialGradient(cx, cy, radius * 0.2, cx, cy, radius);
	grad.addColorStop(0, 'rgba(255,255,255,0.2)');
	grad.addColorStop(0.6, 'rgba(255,255,255,0.05)');
	grad.addColorStop(1, 'rgba(255,255,255,0)');
	ctx.fillStyle = grad;
	ctx.beginPath();
	ctx.arc(cx, cy, radius, 0, Math.PI * 2);
	ctx.fill();
}


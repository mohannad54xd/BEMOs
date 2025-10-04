// Converted from planets/src/getStarfield.js - lightweight starfield generator
export function createStarfieldCanvas(width: number, height: number, seed = 1) {
	const canvas = document.createElement('canvas');
	canvas.width = Math.max(1, Math.floor(width));
	canvas.height = Math.max(1, Math.floor(height));
	const ctx = canvas.getContext('2d')!;
	ctx.fillStyle = 'black';
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	let s = seed >>> 0;
	const rand = (scale: number) => {
		// simple LCG for reproducible pseudo-random
		s = (1664525 * s + 1013904223) >>> 0;
		return (s / 0xffffffff) * scale;
	};

	const starCount = Math.max(8, Math.floor((canvas.width * canvas.height) / 4000));
	for (let i = 0; i < starCount; i++) {
		const x = Math.floor(rand(canvas.width));
		const y = Math.floor(rand(canvas.height));
		const r = Math.max(0.4, rand(1.8));
		const g = ctx.createRadialGradient(x, y, 0, x, y, r * 2);
		const alpha = 0.6 + rand(0.4);
		g.addColorStop(0, `rgba(255,255,255,${alpha})`);
		g.addColorStop(1, 'rgba(255,255,255,0)');
		ctx.fillStyle = g as any;
		ctx.beginPath();
		ctx.arc(x, y, r, 0, Math.PI * 2);
		ctx.fill();
	}

	return canvas;
}


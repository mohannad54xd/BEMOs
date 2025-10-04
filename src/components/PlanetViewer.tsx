import React, { useEffect, useRef, useState } from 'react';
import { createStarfieldCanvas } from './planets/getStarfield';
import { drawFresnelHighlight } from './planets/getFresnelMat';

const PLANETS = [
	{ id: 'mercury', name: 'Mercury', color: '#c2b8a3', img: '/textures/mercury.jpg', diameterKm: 4879, massKg: '3.3e23', periodDays: 88, fun: 'Mercury has extreme temperature swings and a very thin exosphere.' },
	{ id: 'venus', name: 'Venus', color: '#e2c08d', img: '/textures/venus.jpg', diameterKm: 12104, massKg: '4.87e24', periodDays: 225, fun: 'Venus rotates backwards compared to most planets and has a runaway greenhouse effect.' },
	{ id: 'earth', name: 'Earth', color: '#2b9cf3', img: '/textures/00_earthmap1k.jpg', diameterKm: 12742, massKg: '5.97e24', periodDays: 365, fun: 'Earth is the only known world to support life and liquid oceans.' },
	{ id: 'mars', name: 'Mars', color: '#d65a3a', img: '/textures/mars.jpg', diameterKm: 6779, massKg: '6.42e23', periodDays: 687, fun: 'Mars has the tallest volcano (Olympus Mons) and signs of ancient water.' },
	{ id: 'jupiter', name: 'Jupiter', color: '#c28b5a', img: '/textures/jupiter.jpg', diameterKm: 139820, massKg: '1.90e27', periodDays: 4333, fun: 'Jupiter is so massive it could fit all other planets inside it.' },
	{ id: 'saturn', name: 'Saturn', color: '#e3c98b', img: '/textures/saturn.jpg', diameterKm: 116460, massKg: '5.68e26', periodDays: 10759, fun: 'Saturn is known for its spectacular rings made of ice and rock.' },
	{ id: 'uranus', name: 'Uranus', color: '#8fd1e0', img: '/textures/uranus.jpg', diameterKm: 50724, massKg: '8.68e25', periodDays: 30687, fun: 'Uranus tilts on its side, making its seasons extreme.' },
	{ id: 'neptune', name: 'Neptune', color: '#2f6fb3', img: '/textures/neptune.jpg', diameterKm: 49244, massKg: '1.02e26', periodDays: 60190, fun: 'Neptune has supersonic winds and a deep blue color from methane.' },
	{ id: 'pluto', name: 'Pluto', color: '#a88ea4', img: '/textures/Pluto_Made.png', diameterKm: 2376, massKg: '1.31e22', periodDays: 90560, fun: 'Pluto is a small, icy world with heart-shaped Tombaugh Regio.' },
];

// Procedural texture generator: returns an HTMLCanvasElement to be used as a texture
function createPlanetCanvas(id: string, size = 1024) {
	const canvas = document.createElement('canvas');
	canvas.width = size;
	canvas.height = size;
	const ctx = canvas.getContext('2d')!;

	// background
	const bg = {
		earth: '#2b9cf3',
		mars: '#d65a3a',
		jupiter: '#c28b5a',
		saturn: '#e3c98b',
		venus: '#e2c08d',
		mercury: '#c2b8a3',
		uranus: '#8fd1e0',
		neptune: '#2f6fb3',
		pluto: '#a88ea4',
	} as Record<string, string>;

	ctx.fillStyle = bg[id] || '#888';
	ctx.fillRect(0, 0, size, size);

	if (id === 'earth') {
		// draw simple continents
		ctx.fillStyle = '#1f8b3a';
		for (let i = 0; i < 6; i++) {
			ctx.beginPath();
			ctx.ellipse(200 + i * 90, 300 + (i % 2) * 40, 120 - i * 10, 70 - i * 5, i * 0.4, 0, Math.PI * 2);
			ctx.fill();
		}
	}

	if (id === 'mars') {
		// blotches
		ctx.fillStyle = '#b34a2f';
		for (let i = 0; i < 30; i++) {
			ctx.beginPath();
			const x = Math.random() * size;
			const y = Math.random() * size;
			const r = 8 + Math.random() * 40;
			ctx.globalAlpha = 0.6 + Math.random() * 0.3;
			ctx.arc(x, y, r, 0, Math.PI * 2);
			ctx.fill();
		}
		ctx.globalAlpha = 1;
	}

	if (id === 'jupiter' || id === 'saturn') {
		// stripes
		for (let y = 0; y < size; y += 8) {
			ctx.fillStyle = `rgba(0,0,0,${0.02 + Math.abs(Math.sin(y * 0.01)) * 0.08})`;
			ctx.fillRect(0, y, size, 6);
		}
	}

	// subtle noise overlay
	const imgData = ctx.getImageData(0, 0, size, size);
	for (let i = 0; i < imgData.data.length; i += 4) {
		const v = (Math.random() - 0.5) * 8;
		imgData.data[i] = Math.min(255, Math.max(0, imgData.data[i] + v));
		imgData.data[i + 1] = Math.min(255, Math.max(0, imgData.data[i + 1] + v));
		imgData.data[i + 2] = Math.min(255, Math.max(0, imgData.data[i + 2] + v));
	}
	ctx.putImageData(imgData, 0, 0);

	return canvas;
}

export const PlanetViewer: React.FC = () => {
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const animRef = useRef<number | null>(null);
	const [planetIndex, setPlanetIndex] = useState(2); // Earth
	const [angle, setAngle] = useState(0);
	const dragging = useRef(false);
	const lastX = useRef(0);
		const [mode, setMode] = useState<'loading' | '3d' | '2d' | 'error'>('2d');
	const threeRootRef = useRef<HTMLDivElement | null>(null);
	const threeStateRef = useRef<any>(null);
		// UX controls
		const [autoRotate, setAutoRotate] = useState(true);
		const rotationSpeedRef = useRef<number>(0.002);
		// lower default cloud speed for a slower, more subtle drift
		const cloudSpeedRef = useRef<number>(0.35); // multiplier for cloud drift (was 1)
		const [rotationSpeedValue, setRotationSpeedValue] = useState<number>(rotationSpeedRef.current);
		const [cloudSpeedValue, setCloudSpeedValue] = useState<number>(cloudSpeedRef.current);
		const starCanvasRef = useRef<HTMLCanvasElement | null>(null);
		// simple map of planet IDs to local texture URLs (fall back to procedural canvas when missing)
		// detailed local texture map (main + optional maps)
		const PLANET_TEXTURES: Record<string, any> = {
			earth: {
				map: '/textures/00_earthmap1k.jpg',
				bumpMap: '/textures/01_earthbump1k.jpg',
				specularMap: '/textures/02_earthspec1k.jpg',
				cloudMap: '/textures/04_earthcloudmap.jpg',
				cloudAlpha: '/textures/05_earthcloudmaptrans.jpg',
			},
			mars: { map: '/textures/mars.jpg' },
			jupiter: { map: '/textures/jupiter.jpg' },
			saturn: { map: '/textures/saturn.jpg', ring: '/textures/saturn_ring.png' },
			venus: { map: '/textures/venus.jpg' },
			mercury: { map: '/textures/mercury.jpg' },
			uranus: { map: '/textures/uranus.jpg' },
			neptune: { map: '/textures/neptune.jpg' },
			pluto: { map: '/textures/Pluto_Made.png' },
			// helper textures
			stars: { circle: '/textures/stars/circle.png', bg: '/textures/stars.jpg' },
			sun: { map: '/textures/sun.jpg' },
			solar: { map: '/textures/solar-system.png' },
		};
		const useLocalTextures = true;


	// Canvas renderer (fallback) — keeps responsive sizing
		useEffect(() => {
		if (mode === '3d') return; // don't run canvas render when 3D mode active

		const canvas = canvasRef.current!;
		const ctx = canvas.getContext('2d')!;

			const resize = () => {
			const rect = canvas.getBoundingClientRect();
			const width = Math.max(200, Math.floor(rect.width));
			const height = Math.max(120, Math.floor(rect.height));
			canvas.width = Math.floor(width * (window.devicePixelRatio || 1));
			canvas.height = Math.floor(height * (window.devicePixelRatio || 1));
			ctx.setTransform(window.devicePixelRatio || 1, 0, 0, window.devicePixelRatio || 1, 0, 0);
				// recreate starfield for the new size (in CSS pixels)
				try {
					starCanvasRef.current = createStarfieldCanvas(width, height, 42);
				} catch (e) {
					starCanvasRef.current = null;
				}
		};

		resize();
		window.addEventListener('resize', resize);

			// ensure starCanvasRef is populated
			if (!starCanvasRef.current) {
				try {
					const rect = canvas.getBoundingClientRect();
					starCanvasRef.current = createStarfieldCanvas(rect.width, rect.height, 42);
				} catch (e) {
					starCanvasRef.current = null;
				}
			}

		const render = () => {
			const p = PLANETS[planetIndex];
			const rect = canvas.getBoundingClientRect();
			const width = rect.width;
			const height = rect.height;

			ctx.clearRect(0, 0, width, height);
			// draw starfield background (starCanvas is a canvas element)
					// draw starfield background (if available and a canvas)
					const starCanvas = starCanvasRef.current;
					if (starCanvas instanceof HTMLCanvasElement) {
						try {
							// subtle twinkle: modulate starfield alpha with a slow sine
							ctx.save();
							const twinkle = 0.86 + 0.12 * Math.sin(Date.now() / 600 + planetIndex * 0.6);
							ctx.globalAlpha = twinkle;
							ctx.drawImage(starCanvas, 0, 0, width, height);
							ctx.restore();
						} catch (err) {
							// swallow draw errors to avoid crashing the component
						}
					}

			const cx = width / 2;
			const cy = height / 2;
			const radius = Math.min(width, height) * 0.28;

			// subtle glow
			ctx.beginPath();
			ctx.arc(cx, cy, radius + 8, 0, Math.PI * 2);
			ctx.fillStyle = 'rgba(0,0,0,0.35)';
			ctx.fill();

			// planet body
			ctx.save();
			ctx.translate(cx, cy);
			ctx.rotate(angle);
			ctx.translate(-cx, -cy);

			const grd = ctx.createLinearGradient(cx - radius, cy - radius, cx + radius, cy + radius);
			grd.addColorStop(0, p.color);
			grd.addColorStop(1, '#000000');
			ctx.fillStyle = grd;
			ctx.beginPath();
			ctx.arc(cx, cy, radius, 0, Math.PI * 2);
			ctx.fill();

			// simple banding for gas giants
			if (p.id === 'jupiter' || p.id === 'saturn') {
				ctx.globalAlpha = 0.12;
				for (let i = -6; i <= 6; i++) {
					ctx.beginPath();
					ctx.ellipse(cx, cy + i * 8, radius * 0.98, 18 + Math.abs(i) * 2, 0, 0, Math.PI * 2);
					ctx.fillStyle = `rgba(0,0,0,${0.04 + Math.abs(i) * 0.01})`;
					ctx.fill();
				}
				ctx.globalAlpha = 1;
			}

			ctx.restore();

			// highlight
			drawFresnelHighlight(ctx, cx - radius * 0.3, cy - radius * 0.5, radius * 1.1);

			// label
			ctx.fillStyle = 'rgba(255,255,255,0.9)';
			ctx.font = '18px Inter, Arial';
			ctx.textAlign = 'center';
			ctx.fillText(p.name, cx, cy + radius + 28);

			animRef.current = requestAnimationFrame(render);
		};

		render();

		return () => {
			if (animRef.current) cancelAnimationFrame(animRef.current);
			window.removeEventListener('resize', resize);
		};
	}, [planetIndex, angle, mode]);

	// simple auto-rotation (2D fallback) — respects autoRotate and rotation speed control
useEffect(() => {
		const id = setInterval(() => {
			if (autoRotate) setAngle((a) => a + (rotationSpeedRef.current || 0.002));
		}, 50);
		return () => clearInterval(id);
}, [autoRotate]);

	// pointer interaction for canvas rotation
	useEffect(() => {
		const canvas = canvasRef.current!;
		const onDown = (e: PointerEvent) => {
			dragging.current = true;
			lastX.current = e.clientX;
		};
		const onMove = (e: PointerEvent) => {
			if (!dragging.current) return;
			const dx = e.clientX - lastX.current;
			setAngle((a) => a + dx * 0.01);
			lastX.current = e.clientX;
		};
		const onUp = () => { dragging.current = false; };
		canvas.addEventListener('pointerdown', onDown);
		window.addEventListener('pointermove', onMove);
		window.addEventListener('pointerup', onUp);
		return () => {
			canvas.removeEventListener('pointerdown', onDown);
			window.removeEventListener('pointermove', onMove);
			window.removeEventListener('pointerup', onUp);
		};
	}, []);

	// Attempt to dynamically load three.js and render a 3D sphere
	useEffect(() => {
		let mounted = true;
		const tryLoadThree = async () => {
			try {
				const THREE: any = await import('three');
				const { OrbitControls } = await import('three-stdlib');
				if (!mounted) return;

				const container = threeRootRef.current!;
				if (!container) {
					setMode('2d');
					return;
				}

				const width = container.clientWidth || 600;
				const height = container.clientHeight || 400;

				const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
				renderer.setPixelRatio(window.devicePixelRatio);
				renderer.setSize(width, height);
				container.appendChild(renderer.domElement);

				const scene = new THREE.Scene();
				const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
				camera.position.set(0, 0, 3);

				const ambient = new THREE.AmbientLight(0xffffff, 0.6);
				scene.add(ambient);
				const dir = new THREE.DirectionalLight(0xffffff, 0.8);
				dir.position.set(5, 5, 5);
				scene.add(dir);

										const geometry = new THREE.SphereGeometry(1, 64, 64);
										// create textures for the currently selected planet (map of optional maps)
										const planet = PLANETS[planetIndex] || PLANETS[2];
										let texture: any = null;
										let texCanvas: HTMLCanvasElement | null = null;
										const loader = new THREE.TextureLoader();
										const loadedTextures: any = {};

										if (useLocalTextures && PLANET_TEXTURES[planet.id]) {
											const info = PLANET_TEXTURES[planet.id];
											// helper to load a texture or return null
											const loadTex = (url: string | undefined) => {
												if (!url) return Promise.resolve(null);
												return new Promise<any>((resolve) => {
													loader.load(url, (tex: any) => resolve(tex), undefined, () => resolve(null));
												});
											};

											// load commonly used maps in parallel
											const promises = {
												map: loadTex(info.map),
												bumpMap: loadTex(info.bumpMap),
												specularMap: loadTex(info.specularMap),
												lightsMap: loadTex(info.lightsMap),
												cloudMap: loadTex(info.cloudMap),
												cloudAlpha: loadTex(info.cloudAlpha),
												ring: loadTex(info.ring),
											};

											const results = await Promise.all(Object.values(promises));
											const keys = Object.keys(promises);
											keys.forEach((k, i) => { loadedTextures[k] = results[i]; });
											texture = loadedTextures.map || null;

											// normalize texture parameters to avoid sampling/wrapping artifacts
											const normalize = (tex: any) => {
												if (!tex) return;
												try {
													tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping;
													tex.minFilter = THREE.LinearMipMapLinearFilter;
													tex.magFilter = THREE.LinearFilter;
													// prefer sRGB for color textures
													if (THREE && THREE.sRGBEncoding) tex.encoding = THREE.sRGBEncoding;
													tex.generateMipmaps = true;
													tex.needsUpdate = true;
													// anisotropy if renderer available
													try {
														const maxAniso = renderer.capabilities && renderer.capabilities.getMaxAnisotropy ? renderer.capabilities.getMaxAnisotropy() : renderer.capabilities.getMaxAnisotropy && renderer.capabilities.getMaxAnisotropy();
														if (maxAniso && tex.anisotropy !== undefined) tex.anisotropy = maxAniso;
													} catch (e) {}
												} catch (e) {}
											};
											Object.values(loadedTextures).forEach((t: any) => normalize(t));
										}

										// fallback to procedural canvas texture
										if (!texture) {
											texCanvas = createPlanetCanvas(planet.id, 1024);
											texture = new THREE.CanvasTexture(texCanvas);
											texture.needsUpdate = true;
										}

										// choose material type depending on maps available
										let material: any = null;
										if (loadedTextures && loadedTextures.bumpMap || loadedTextures && loadedTextures.specularMap) {
											material = new THREE.MeshPhongMaterial({
												map: texture,
												bumpMap: loadedTextures.bumpMap || null,
												bumpScale: loadedTextures.bumpMap ? 0.04 : 0,
												specularMap: loadedTextures.specularMap || null,
												shininess: loadedTextures.specularMap ? 10 : 2,
											});
										} else {
											material = new THREE.MeshStandardMaterial({ map: texture, metalness: 0.05, roughness: 0.85 });
										}

										const sphere = new THREE.Mesh(geometry, material);
										// base sphere should render first
										sphere.renderOrder = 0;
										if (sphere.material) {
											sphere.material.depthWrite = true;
											sphere.material.depthTest = true;
											sphere.material.transparent = false;
										}
										scene.add(sphere);

										// add earth lights / clouds if available
										let lightsMesh: any = null;
										let cloudsMesh: any = null;
										if (loadedTextures && loadedTextures.lightsMap) {
											const lightsMat = new THREE.MeshBasicMaterial({
												map: loadedTextures.lightsMap,
												blending: THREE.AdditiveBlending,
												transparent: true,
												depthWrite: false,
												depthTest: true,
												alphaTest: 0.01,
												polygonOffset: true,
												polygonOffsetFactor: -1,
												polygonOffsetUnits: 1,
											});
											lightsMesh = new THREE.Mesh(geometry, lightsMat);
											// render after sphere but before clouds
											lightsMesh.renderOrder = 10;
											scene.add(lightsMesh);
										}
										if (loadedTextures && loadedTextures.cloudMap) {
											// make cloud textures repeatable so we can scroll their UVs for motion
											try {
												if (loadedTextures.cloudMap) { loadedTextures.cloudMap.wrapS = loadedTextures.cloudMap.wrapT = THREE.RepeatWrapping; loadedTextures.cloudMap.repeat.set(1, 1); loadedTextures.cloudMap.needsUpdate = true; }
												if (loadedTextures.cloudAlpha) { loadedTextures.cloudAlpha.wrapS = loadedTextures.cloudAlpha.wrapT = THREE.RepeatWrapping; loadedTextures.cloudAlpha.repeat.set(1, 1); loadedTextures.cloudAlpha.needsUpdate = true; }
											} catch (e) {}

											const cloudsMat = new THREE.MeshStandardMaterial({
												map: loadedTextures.cloudMap,
												transparent: true,
												blending: THREE.NormalBlending,
												alphaMap: loadedTextures.cloudAlpha || undefined,
												depthWrite: false,
												depthTest: true,
												side: THREE.DoubleSide,
												polygonOffset: true,
												polygonOffsetFactor: -1,
												polygonOffsetUnits: 1,
											});
											cloudsMesh = new THREE.Mesh(geometry.clone(), cloudsMat);
											// nudge clouds slightly outward to reduce z-fighting with the base sphere
											cloudsMesh.scale.setScalar(1.004);
											scene.add(cloudsMesh);
										}

										// Saturn ring
										let ringMesh: any = null;
										if (loadedTextures && loadedTextures.ring) {
											const ringTex = loadedTextures.ring;
											const innerRadius = 1.2;
											const outerRadius = 2.5;
											const ringGeo = new THREE.RingGeometry(innerRadius, outerRadius, 64);
											const ringMat = new THREE.MeshBasicMaterial({ map: ringTex, side: THREE.DoubleSide, transparent: true, opacity: 0.9 });
											ringMesh = new THREE.Mesh(ringGeo, ringMat);
											ringMesh.rotation.x = -0.5 * Math.PI;
											scene.add(ringMesh);
										}

						// add a simple starfield using Points
						const starCount = 2000;
						const starPositions = new Float32Array(starCount * 3);
						for (let i = 0; i < starCount; i++) {
							const r = 50 + Math.random() * 400;
							const theta = Math.random() * Math.PI * 2;
							const phi = Math.acos((Math.random() * 2) - 1);
							starPositions[i * 3 + 0] = r * Math.sin(phi) * Math.cos(theta);
							starPositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
							starPositions[i * 3 + 2] = r * Math.cos(phi);
						}
						const starsGeo = new THREE.BufferGeometry();
						starsGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
						const starsMat = new THREE.PointsMaterial({ color: 0xffffff, size: 1.2, sizeAttenuation: true, opacity: 0.9, transparent: true });
						const starPoints = new THREE.Points(starsGeo, starsMat);
						scene.add(starPoints);

				const controls = new OrbitControls(camera, renderer.domElement);
				controls.enableDamping = true;
				controls.dampingFactor = 0.08;

				const onResize = () => {
					const w = container.clientWidth || 600;
					const h = container.clientHeight || 400;
					renderer.setSize(w, h);
					camera.aspect = w / h;
					camera.updateProjectionMatrix();
				};

				window.addEventListener('resize', onResize);

				const animate = () => {
					if (!mounted) return;
					// sphere rotates (controlled)
					if (typeof rotationSpeedRef.current === 'number' && autoRotate) {
						sphere.rotation.y += rotationSpeedRef.current;
					} else if (autoRotate) {
						sphere.rotation.y += 0.002;
					}
					// small cloud drift via UV offset (if present)
					try {
						if (cloudsMesh && cloudsMesh.material) {
							const m: any = cloudsMesh.material;
							if (m.map) {
								// cloudSpeedRef multiplies the base drift so users can dial it up/down
								// reduced base drift values and multiplied by cloudSpeedRef for fine control
								const baseX = 0.00018 * (cloudSpeedRef.current || 0.35);
								const baseY = 0.00006 * (cloudSpeedRef.current || 0.35);
								m.map.offset.x = (m.map.offset.x + baseX) % 1.0;
								m.map.offset.y = (m.map.offset.y + baseY) % 1.0;
								m.map.needsUpdate = true;
							}
							if (m.alphaMap) {
								const baseX = 0.00018 * (cloudSpeedRef.current || 0.35);
								const baseY = 0.00006 * (cloudSpeedRef.current || 0.35);
								m.alphaMap.offset.x = (m.alphaMap.offset.x + baseX) % 1.0;
								m.alphaMap.offset.y = (m.alphaMap.offset.y + baseY) % 1.0;
								m.alphaMap.needsUpdate = true;
							}
						}
					} catch (e) {}
					controls.update();
					renderer.render(scene, camera);
					requestAnimationFrame(animate);
				};
				animate();

				threeStateRef.current = { renderer, scene, camera, controls, container, onResize, texture, texCanvas, starsGeo, starsMat, geometry, material, loadedTextures, lightsMesh, cloudsMesh, ringMesh, starPoints };
				setMode('3d');
			} catch (err) {
				setMode('2d');
				// three.js may not be installed — fallback silently to 2D
				// console.warn('three.js not available; falling back to 2D canvas renderer.', err);
			}
		};

		tryLoadThree();

		return () => {
			mounted = false;
			const s = threeStateRef.current;
			if (s) {
						try {
							s.controls.dispose && s.controls.dispose();
							s.renderer.dispose && s.renderer.dispose();
							if (s.texture) s.texture.dispose && s.texture.dispose();
							if (s.loadedTextures) {
								Object.values(s.loadedTextures).forEach((t: any) => { if (t && t.dispose) try { t.dispose(); } catch (e) {} });
							}
							if (s.starsGeo) s.starsGeo.dispose && s.starsGeo.dispose();
							if (s.starsMat) s.starsMat.dispose && s.starsMat.dispose();
							if (s.starPoints) s.starPoints.geometry && s.starPoints.geometry.dispose && s.starPoints.geometry.dispose();
							if (s.lightsMesh) { s.lightsMesh.geometry && s.lightsMesh.geometry.dispose && s.lightsMesh.geometry.dispose(); s.lightsMesh.material && s.lightsMesh.material.dispose && s.lightsMesh.material.dispose(); }
							if (s.cloudsMesh) { s.cloudsMesh.geometry && s.cloudsMesh.geometry.dispose && s.cloudsMesh.geometry.dispose(); s.cloudsMesh.material && s.cloudsMesh.material.dispose && s.cloudsMesh.material.dispose(); }
							if (s.ringMesh) { s.ringMesh.geometry && s.ringMesh.geometry.dispose && s.ringMesh.geometry.dispose(); s.ringMesh.material && s.ringMesh.material.dispose && s.ringMesh.material.dispose(); }
							if (s.geometry) s.geometry.dispose && s.geometry.dispose();
							if (s.material) s.material.dispose && s.material.dispose();
							if (s.renderer && s.renderer.domElement && s.container && s.container.contains(s.renderer.domElement)) s.container.removeChild(s.renderer.domElement);
							window.removeEventListener('resize', s.onResize);
						} catch (e) {
							// ignore cleanup errors
						}
			}
			};
	}, [planetIndex]);

	// preview removed — always use local textures

	return (
		<div className="bg-space-black/60 p-4 rounded-lg">
			<div className="flex flex-col md:flex-row gap-4 items-start">
			<div className="w-full rounded-md shadow-2xl bg-black relative overflow-hidden h-64 sm:h-80 md:h-[520px] lg:h-[680px] xl:h-[760px] border border-white/5">
					{/* three.js container */}
					  <div ref={threeRootRef} className={`absolute inset-0 ${mode === '3d' ? 'block' : 'hidden'}`} style={{ width: '100%', height: '100%' }} />
					{/* canvas fallback */}
					  <canvas ref={canvasRef} className={`w-full h-full rounded-md ${mode === '3d' ? 'hidden' : 'block'}`} />
				</div>

				<div className="w-full md:w-64 lg:w-72">
					<h3 className="text-white font-semibold mb-2">Planets</h3>
					<div className="flex gap-2 mb-3 overflow-x-auto no-scrollbar py-1">
						{PLANETS.map((p, i) => (
							<button
								key={p.id}
								onClick={() => setPlanetIndex(i)}
								aria-pressed={i === planetIndex}
								className={`flex-shrink-0 text-sm text-center px-3 py-2 rounded-md transform transition-transform duration-200 ease-out ${i === planetIndex ? 'bg-white/10 scale-105 shadow-lg' : 'hover:scale-105 hover:bg-white/4'} text-white w-24`}
							>
								<div className="font-medium">{p.name}</div>
							</button>
						))}
					</div>
					<div className="mb-3 text-xs text-gray-200 bg-black/60 p-3 rounded-md border border-white/6 flex gap-3 items-start">
						{PLANETS[planetIndex] && (
							<>
								<div className="relative inline-block">
									<img src={PLANETS[planetIndex].img} alt={`${PLANETS[planetIndex].name} thumbnail`} className="w-20 h-20 rounded-md object-cover border border-white/8 shadow-sm" />
									{/** pulsing ring for selected planet */}
									<span className="absolute -inset-1 rounded-full border border-white/10 opacity-60 animate-pulse-slow" style={{ boxShadow: '0 0 18px rgba(255,255,255,0.04)' }} />
								</div>
								<div>
									<div className="font-semibold text-white mb-1 text-sm">{PLANETS[planetIndex].name}</div>
									<div className="text-[12px]">Diameter: <span className="font-medium">{PLANETS[planetIndex].diameterKm.toLocaleString()} km</span></div>
									<div className="text-[12px]">Mass: <span className="font-medium">{PLANETS[planetIndex].massKg}</span></div>
									<div className="text-[12px]">Orbital period: <span className="font-medium">{PLANETS[planetIndex].periodDays} days</span></div>
									<div className="mt-2 text-[12px] italic text-gray-300">{PLANETS[planetIndex].fun}</div>
								</div>
							</>
						)}
					</div>
					<div className="flex gap-2">
						<button onClick={() => setMode('3d')} className="px-3 py-2 rounded-md bg-white/6 text-white">Try 3D</button>
						<button onClick={() => setMode('2d')} className="px-3 py-2 rounded-md bg-white/6 text-white">2D Canvas</button>
					</div>
					{/* Controls */}
					<div className="mt-3 p-3 bg-gradient-to-br from-white/6 to-white/3 rounded-md">
						<div className="flex items-center justify-between mb-2">
							<div className="text-xs text-gray-100">Auto-rotate</div>
							<label className="inline-flex items-center cursor-pointer" aria-label="Toggle auto rotate">
								<input aria-label="Auto rotate" type="checkbox" checked={autoRotate} onChange={(e) => setAutoRotate(e.target.checked)} className="mr-2" />
							</label>
						</div>
						<div className="text-xs text-gray-100 mb-1">Rotation speed: {rotationSpeedValue.toFixed(4)}</div>
						<input
							type="range"
							min={0}
							max={0.02}
							step={0.0005}
							value={rotationSpeedValue}
							onChange={(e) => { const v = Number(e.target.value); setRotationSpeedValue(v); rotationSpeedRef.current = v; }}
							className="w-full mb-3"
						/>
						<div className="text-xs text-gray-100 mb-1">Cloud speed: {cloudSpeedValue.toFixed(2)}x</div>
						<input
							type="range"
							min={0}
							max={3}
							step={0.05}
							value={cloudSpeedValue}
							onChange={(e) => { const v = Number(e.target.value); setCloudSpeedValue(v); cloudSpeedRef.current = v; }}
							className="w-full"
						/>
					</div>
					<div className="mt-3 flex items-center gap-2">
						{/* local textures always enabled */}
					</div>

					<div className="mt-3 text-xs text-gray-300">Mode: {mode}</div>
				</div>
			</div>
		</div>
	);
};

export default PlanetViewer;

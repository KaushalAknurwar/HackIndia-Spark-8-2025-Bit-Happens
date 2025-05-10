import React, { useState, useRef, useEffect } from 'react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import * as THREE from 'three';

const PunchingBag: React.FC = () => {
	const navigate = useNavigate();
	const [imageUrl, setImageUrl] = useState<string>('/placeholder.svg');
	const [punchStrength, setPunchStrength] = useState(0);
	const [punchCount, setPunchCount] = useState(0);
	const containerRef = useRef<HTMLDivElement>(null);
	const sceneRef = useRef<THREE.Scene | null>(null);
	const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
	const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
	const punchingBagRef = useRef<THREE.Group | null>(null);
	const velocityRef = useRef({ x: 0, z: 0 });
	const lastTimeRef = useRef(0);
	const audioRef = useRef<HTMLAudioElement>(null);
	const crowdSoundRef = useRef<HTMLAudioElement>(null);
	const ambientCrowdRef = useRef<HTMLAudioElement>(null);
	const audienceRef = useRef<THREE.Group[]>([]);
	useEffect(() => {
		const punchSound = new Audio('/sounds/punch.mp3');
		punchSound.volume = 0.5;
		audioRef.current = punchSound;

	}, []);

	useEffect(() => {
		if (!containerRef.current) return;

		// Create scene hierarchy and basic setup
		const scene = new THREE.Scene();
		sceneRef.current = scene;
		scene.background = new THREE.Color(0x1a1a1a);
		scene.fog = new THREE.FogExp2(0x1a1a1a, 0.015);

		// Create dojo environment
		const createDojoEnvironment = () => {
			// Wooden floor
			const floorGeometry = new THREE.PlaneGeometry(20, 20);
			const floorMaterial = new THREE.MeshStandardMaterial({
				color: 0x8B4513, // Dark brown
				roughness: 0.8,
				metalness: 0.2
			});
			const floor = new THREE.Mesh(floorGeometry, floorMaterial);
			floor.rotation.x = -Math.PI / 2;
			floor.position.y = -3;
			floor.receiveShadow = true;
			scene.add(floor);

			// Dark brown walls
			const wallGeometry = new THREE.BoxGeometry(20, 10, 0.2);
			const wallMaterial = new THREE.MeshStandardMaterial({
				color: 0x4A3B22, // Dark brown
				roughness: 0.9,
				metalness: 0.1
			});


			// Back wall
			const backWall = new THREE.Mesh(wallGeometry, wallMaterial);
			backWall.position.set(0, 2, -10);
			backWall.receiveShadow = true;
			scene.add(backWall);

			// Side walls
			const leftWall = new THREE.Mesh(wallGeometry, wallMaterial);
			leftWall.rotation.y = Math.PI / 2;
			leftWall.position.set(-10, 2, 0);
			leftWall.receiveShadow = true;
			scene.add(leftWall);

			const rightWall = new THREE.Mesh(wallGeometry, wallMaterial);
			rightWall.rotation.y = Math.PI / 2;
			rightWall.position.set(10, 2, 0);
			rightWall.receiveShadow = true;
			scene.add(rightWall);

			// Create shoji screens
			const shojiGeometry = new THREE.PlaneGeometry(4, 8);
			const shojiMaterial = new THREE.MeshStandardMaterial({
				color: 0xFFF5E6,
				transparent: true,
				opacity: 0.6,
				side: THREE.DoubleSide
			});

			// Add shoji screens to back wall
			const screenPositions = [-5, 0, 5];
			screenPositions.forEach(x => {
				const shoji = new THREE.Mesh(shojiGeometry, shojiMaterial);
				shoji.position.set(x, 1, -9.8);
				scene.add(shoji);

				// Add wooden frame
				const frameGeometry = new THREE.BoxGeometry(4.2, 8.2, 0.1);
				const frameMaterial = new THREE.MeshStandardMaterial({
					color: 0x4A3B22
				});
				const frame = new THREE.Mesh(frameGeometry, frameMaterial);
				frame.position.set(x, 1, -9.9);
				scene.add(frame);
			});




			// Add wooden beams
			const beamGeometry = new THREE.BoxGeometry(20, 0.3, 0.3);
			const beamMaterial = new THREE.MeshStandardMaterial({
				color: 0x4A3B22,
				roughness: 0.8
			});

			const createBeam = (y: number) => {
				const beam = new THREE.Mesh(beamGeometry, beamMaterial);
				beam.position.set(0, y, -10);
				scene.add(beam);
			};

			createBeam(6);
			createBeam(4);

			// Warmer ambient lighting
			const ambientLight = new THREE.AmbientLight(0xffd700, 0.4); // Golden ambient light
			scene.add(ambientLight);

			// Softer directional light
			const mainLight = new THREE.DirectionalLight(0xffd700, 0.3); // Golden directional light
			mainLight.position.set(5, 10, 5);
			mainLight.castShadow = true;
			mainLight.shadow.camera.far = 25;
			mainLight.shadow.mapSize.width = 2048;
			mainLight.shadow.mapSize.height = 2048;
			scene.add(mainLight);

		};

		// Create dojo environment
		createDojoEnvironment();

		// Camera setup
		const camera = new THREE.PerspectiveCamera(75, containerRef.current.clientWidth / containerRef.current.clientHeight, 0.1, 1000);
		cameraRef.current = camera;
		camera.position.set(-6, 4, 8);
		camera.lookAt(0, 0, 0);

		// Renderer setup
		const renderer = new THREE.WebGLRenderer({ antialias: true });
		rendererRef.current = renderer;
		renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
		renderer.shadowMap.enabled = true;
		containerRef.current.appendChild(renderer.domElement);

		// Create ring floor with canvas texture
		const canvas = document.createElement('canvas');
		const ctx = canvas.getContext('2d');
		canvas.width = 512;
		canvas.height = 512;
		if (ctx) {
			// Main floor color
			ctx.fillStyle = '#2a2a2a';
			ctx.fillRect(0, 0, 512, 512);
			
			// Ring border
			ctx.strokeStyle = '#ffffff';
			ctx.lineWidth = 8;
			ctx.strokeRect(10, 10, 492, 492);
			
			// Add ring pattern
			ctx.strokeStyle = '#3a3a3a';
			ctx.lineWidth = 2;
			for (let i = 50; i < 512; i += 50) {
				ctx.beginPath();
				ctx.moveTo(i, 0);
				ctx.lineTo(i, 512);
				ctx.stroke();
				ctx.beginPath();
				ctx.moveTo(0, i);
				ctx.lineTo(512, i);
				ctx.stroke();
			}
		}
		const floorTexture = new THREE.CanvasTexture(canvas);
		const floorMaterial = new THREE.MeshStandardMaterial({ 
			map: floorTexture,
			roughness: 0.8 
		});

		// Create ring floor
		const floorGeometry = new THREE.PlaneGeometry(12, 12);
		const floor = new THREE.Mesh(floorGeometry, floorMaterial);
		floor.rotation.x = -Math.PI / 2;
		floor.position.y = -3;
		floor.receiveShadow = true;
		scene.add(floor);

		// Create ring posts
		const postGeometry = new THREE.CylinderGeometry(0.1, 0.1, 4, 8);
		const postMaterial = new THREE.MeshStandardMaterial({ 
			color: 0x888888, 
			metalness: 0.9,
			roughness: 0.2 
		});
		const posts = [];
		const postPositions = [
			{ x: 5, z: 5 }, { x: -5, z: 5 }, 
			{ x: 5, z: -5 }, { x: -5, z: -5 }
		];

		postPositions.forEach(pos => {
			const post = new THREE.Mesh(postGeometry, postMaterial);
			post.position.set(pos.x, -1, pos.z);
			post.castShadow = true;
			scene.add(post);
			posts.push(post);
		});

		// Create ring ropes
		const ropeGeometry = new THREE.CylinderGeometry(0.03, 0.03, 10, 8);
		ropeGeometry.rotateZ(Math.PI / 2);
		const ropeMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000, metalness: 0.3 });
		const ropeHeights = [-1.5, -0.5, 0.5];

		ropeHeights.forEach(height => {
			// Front rope
			const frontRope = new THREE.Mesh(ropeGeometry, ropeMaterial);
			frontRope.position.set(0, height, 5);
			scene.add(frontRope);

			// Back rope
			const backRope = new THREE.Mesh(ropeGeometry, ropeMaterial);
			backRope.position.set(0, height, -5);
			scene.add(backRope);

			// Left rope
			const leftRope = new THREE.Mesh(ropeGeometry.clone().rotateY(Math.PI / 2), ropeMaterial);
			leftRope.position.set(-5, height, 0);
			scene.add(leftRope);

			// Right rope
			const rightRope = new THREE.Mesh(ropeGeometry.clone().rotateY(Math.PI / 2), ropeMaterial);
			rightRope.position.set(5, height, 0);
			scene.add(rightRope);
		});

		// Update lighting setup with enhanced values
		const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
		scene.add(ambientLight);

		// Add ring corner spotlights
		const cornerLights = [
			{ x: 6, z: 6 }, { x: -6, z: 6 },
			{ x: 6, z: -6 }, { x: -6, z: -6 }
		];

		cornerLights.forEach(pos => {
			const spotLight = new THREE.SpotLight(0xffffee, 3);
			spotLight.position.set(pos.x, 8, pos.z);
			spotLight.target.position.set(0, 0, 0);
			spotLight.angle = Math.PI / 4;
			spotLight.penumbra = 0.7;
			spotLight.decay = 1.5;
			spotLight.distance = 25;
			spotLight.castShadow = true;
			scene.add(spotLight);
			scene.add(spotLight.target);
		});

		// Add enhanced overhead ring light
		const ringLight = new THREE.PointLight(0xffffee, 2.5);
		ringLight.position.set(0, 12, 0);
		ringLight.castShadow = true;
		scene.add(ringLight);

		// Load texture for the bag
		const textureLoader = new THREE.TextureLoader();
		const texture = textureLoader.load(imageUrl);
		texture.wrapS = THREE.RepeatWrapping;
		texture.wrapT = THREE.RepeatWrapping;
		texture.repeat.set(0.5, 1); // Make texture cover half the circumference
		texture.offset.x = 0; // Center the texture on the front





		// Create punching bag group
		const punchingBag = new THREE.Group();
		punchingBagRef.current = punchingBag;
		scene.add(punchingBag);

		// Create bag with curved top
		const segments = 32;
		const bagGeometry = new THREE.CylinderGeometry(1.5, 1.5, 6, segments, 1, false);

		// Modify geometry for curved top
		const positions = bagGeometry.attributes.position;
		for (let i = 0; i < positions.count; i++) {
			const y = positions.getY(i);
			if (y > 2) {
				const factor = (y - 2) / 4;
				const x = positions.getX(i);
				const z = positions.getZ(i);
				positions.setXYZ(
					i,
					x * (1 - factor * 0.3),
					y,
					z * (1 - factor * 0.3)
				);
			}
		}
		bagGeometry.computeVertexNormals();

		const bagMaterial = new THREE.MeshStandardMaterial({ 
			color: 0x9F9EA1,
			metalness: 0.6,
			roughness: 0.3,
			map: texture
		});

		const bag = new THREE.Mesh(bagGeometry, bagMaterial);
		bag.position.y = 2;
		bag.castShadow = true;
		bag.rotation.y = Math.PI / 2 - Math.PI / 6;
		punchingBag.add(bag);

		scene.add(punchingBag);

		// Add audience elements (placeholder)
		const audience: THREE.Group[] = []; // Replace with actual audience creation
		audienceRef.current = audience;

		const animate = (currentTime: number) => {
			if (!punchingBagRef.current) return;
			
			const deltaTime = (currentTime - lastTimeRef.current) / 1000;
			lastTimeRef.current = currentTime;




			// Apply damping
			velocityRef.current.x *= 0.98;
			velocityRef.current.z *= 0.98;

			// Spring forces
			const springStrength = 2.0;
			const currentRotationX = punchingBagRef.current.rotation.x;
			const currentRotationZ = punchingBagRef.current.rotation.z;
			
			velocityRef.current.x -= currentRotationX * springStrength * deltaTime;
			velocityRef.current.z -= currentRotationZ * springStrength * deltaTime;

			// Update rotation
			punchingBagRef.current.rotation.x += velocityRef.current.x * deltaTime;
			punchingBagRef.current.rotation.z += velocityRef.current.z * deltaTime;








			renderer.render(scene, camera);
			requestAnimationFrame(animate);
		};

		const handleClick = (event: MouseEvent) => {
			if (!punchingBagRef.current || !cameraRef.current) return;

			const rect = renderer.domElement.getBoundingClientRect();
			const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
			const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

			const raycaster = new THREE.Raycaster();
			raycaster.setFromCamera(new THREE.Vector2(x, y), cameraRef.current);

			const intersects = raycaster.intersectObject(punchingBagRef.current, true);

			if (intersects.length > 0) {
				const force = 5 + Math.sqrt(x * x + y * y) * 3;
				velocityRef.current.x += (Math.random() - 0.5) * force;
				velocityRef.current.z += (Math.random() - 0.5) * force;

				// Play punch sound
				if (audioRef.current) {
					audioRef.current.currentTime = 0;
					audioRef.current.play();
				}


				const strength = Math.min(Math.floor(force * 10), 100);
				setPunchStrength(strength);
				setPunchCount(prev => prev + 1);

				// Make audience more excited on stronger hits
				audienceRef.current.forEach((person) => {
					person.userData.animationOffset = Math.random() * Math.PI * 2;
				});

				setTimeout(() => {
					setPunchStrength(0);
				}, 400);
			}

		};

		renderer.domElement.addEventListener('click', handleClick);
		requestAnimationFrame(animate);

		const handleResize = () => {
			if (!cameraRef.current || !rendererRef.current) return;
			const width = window.innerWidth;
			const height = window.innerHeight;
			cameraRef.current.aspect = width / height;
			cameraRef.current.updateProjectionMatrix();
			rendererRef.current.setSize(width, height);
		};


		window.addEventListener('resize', handleResize);

		return () => {
			window.removeEventListener('resize', handleResize);
			renderer.domElement.removeEventListener('click', handleClick);
			if (containerRef.current && renderer.domElement) {
				containerRef.current.removeChild(renderer.domElement);
			}
		};
	}, [imageUrl]);




	return (
		<div 
			ref={containerRef} 
			className="w-full h-screen"
			style={{ cursor: 'pointer' }}
		>
			<Button
				onClick={() => navigate('/games')}
				className="absolute top-4 left-4 bg-black/50 hover:bg-black/70 text-white"
			>
				Back to Games
			</Button>
			<div className="absolute top-4 left-1/2 transform -translate-x-1/2 text-white bg-black/50 px-4 py-2 rounded-full">
				Click the punching bag to hit it!
			</div>
			<input 
				type="file"
				accept="image/*"
				className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white"
				onChange={(e) => {
					if (e.target.files && e.target.files[0]) {
						const url = URL.createObjectURL(e.target.files[0]);
						setImageUrl(url);
					}
				}}
			/>
			<div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2">
				<div className="text-white bg-black/50 px-4 py-2 rounded-full">
					Punches: {punchCount}
				</div>
				<div className="w-64">
					<Progress value={punchStrength} className="mt-1" />
				</div>
			</div>
		</div>
	);
};

export default PunchingBag;


<script setup>
import { onMounted, ref } from 'vue';
import * as THREE from 'three';
import { EXRLoader } from 'three/examples/jsm/Addons.js';
import { HDRLoader } from 'three/examples/jsm/loaders/HDRLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { apartmentAssetManifest } from './apartment-assets';
import { AssetManager } from '../common/assets/asset-manager';

const canvasContainer = ref(null);
let scene, camera, renderer;
let animationId;
const assetManager = new AssetManager();

const initThreeJS = async () => {
	if (!canvasContainer.value) return;

	// Scene setup
	scene = new THREE.Scene();
	scene.background = new THREE.Color(0x1a1a2e);

	const assets = apartmentAssetManifest;
	await assetManager.loadManifest(assets);
	
	console.log('All assets loaded');

	// Camera setup
	const width = canvasContainer.value.clientWidth;
	const height = canvasContainer.value.clientHeight;
	camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
	camera.position.x = 3;
	camera.position.y = 3;
	camera.position.z = -3;

	// Renderer setup
	renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setSize(width, height);
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.toneMapping = THREE.NeutralToneMapping;
	//renderer.toneMappingExposure = 1.5;
	canvasContainer.value.appendChild(renderer.domElement);

	let controls = new OrbitControls(camera, renderer.domElement);
	controls.screenSpacePanning = false;

	// Create a simple rotating cube
	const geometry = new THREE.BoxGeometry(1, 1, 1);
	const material = new THREE.MeshPhongMaterial({ color: 0x00ff88 });
	const cube = new THREE.Mesh(geometry, material);
	scene.add(cube);

	const planeGeometry = new THREE.PlaneGeometry(100, 100);
	const planeMaterial = new THREE.MeshBasicMaterial({ color: 0xdddddd /*color: 0x404040, roughness: 0.8*/ });
	assetManager.load(apartmentAssetManifest.groundMap).then((groundMapTexture) => {
		planeMaterial.map = groundMapTexture;
	})
	const plane = new THREE.Mesh(planeGeometry, planeMaterial);
	plane.rotation.x = -Math.PI / 2;
	plane.position.y = -5;

	// Add lighting
	const light = new THREE.DirectionalLight(0xffffff, 1);
	light.position.set(5, 5, 5);
	scene.add(light);

	const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
	scene.add(ambientLight);

	const buildingModel = await assetManager.load(assets.buildingModel);
	buildingModel.scene.scale.set(0.1, 0.1, 0.1);
	buildingModel.scene.position.y += 0.5;
	buildingModel.scene.add(plane);
	scene.add(buildingModel.scene);

	const buildingGroundModel = await assetManager.load(assets.buildingGroundModel);
	buildingGroundModel.scene.scale.set(0.1, 0.1, 0.1);
	//buildingGroundModel.scene.position.y += 0.5;
	buildingGroundModel.scene.add(plane);
	scene.add(buildingGroundModel.scene);

	const floorModel = buildingModel.scene.getObjectByName("Floor");
	console.log(floorModel);
	for (let i = 0; i < floorModel.children.length; i++) {
		const child = floorModel.children[i];
		console.log(child.material);

		if (!child.material)
			continue;

		if (child.material.name === 'Glass'){
			child.material = glassMaterial;
		}
		if (child.material.name === 'Walls') {
			child.material.map.wrapS =
			child.material.map.wrapT =
				THREE.ClampToEdgeWrapping;
			//child.material.color.multiplyScalar(0.4);
			//child.material.emissive = child.material.color;
		}
	}
	let groundFloorModel = buildingModel.scene.getObjectByName("GroundFloor");

	for (let i = 0; i < groundFloorModel.children.length; i++) {
		let child = groundFloorModel.children[i];

		if (!child.material)
			continue;

		if (child.material.name === 'Glass') {
			child.material = glassMaterial;
		}
	}
	
	const floorContainer = new THREE.Group();
	buildingModel.scene.add(floorContainer);
	const floorCount = 21;
	for (let i = 1; i < floorCount; i++) {
		const floor = floorModel.clone();
		floor.floorIndex = i;
		floor.position.y = i * 3;
		const scaleValue = Math.sin((i / floorCount) * Math.PI); // Scale between 0.5 and 1
		const fsv = Math.max(1, scaleValue*scaleValue+0.5);
		//floor.scale.set(fsv, fsv, fsv);
		floorContainer.add(floor);
	}
	floorModel.floorIndex = 0;
	floorContainer.add(floorModel);

	const roofModel = buildingModel.scene.getObjectByName("Roof");
	roofModel.position.y = floorCount * 3;


	// Scene background
	const backgroundTexture = await assetManager.load(assets.skyboxTexture);
		backgroundTexture.mapping = THREE.EquirectangularReflectionMapping;
		scene.background = backgroundTexture;
		scene.environment = backgroundTexture;
		scene.backgroundBlurriness = 0.75;

	const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(256, {
		type: backgroundTexture.type,
		format: backgroundTexture.format,
		colorSpace: backgroundTexture.colorSpace,
		generateMipmaps: true,
		minFilter: THREE.LinearMipmapLinearFilter,
		magFilter: THREE.LinearFilter,
	});

	cubeRenderTarget.fromEquirectangularTexture(renderer, backgroundTexture);
	glassMaterial.uniforms.skyboxTexture.value = cubeRenderTarget.texture;

	// Handle window resize
	const handleResize = () => {
		const newWidth = canvasContainer.value.clientWidth;
		const newHeight = canvasContainer.value.clientHeight;
		camera.aspect = newWidth / newHeight;
		camera.updateProjectionMatrix();
		renderer.setSize(newWidth, newHeight);
	};

	window.addEventListener('resize', handleResize);
	// Animation loop
	const animate = () => {
		//animationId = requestAnimationFrame(animate);
		
		// Rotate the cube
		cube.rotation.x += 0.01;
		cube.rotation.y += 0.01;

		renderer.render(scene, camera);
	};
	renderer.setAnimationLoop(animate);

	animate();

	// Cleanup function
	return () => {
		window.removeEventListener('resize', handleResize);
		cancelAnimationFrame(animationId);
		renderer.dispose();
	};
};
var assets = {
	skyboxTexture: null,
};


assetManager.load(apartmentAssetManifest.groundReflectionMap).then((groundReflectionMapTexture) => {
	glassMaterial.uniforms.groundMap.value = groundReflectionMapTexture;
})
assetManager.load(apartmentAssetManifest.groundMap).then((groundMapTexture) => {
	glassMaterial.uniforms.groundMapHigh.value = groundMapTexture;
})


const glassMaterial = new THREE.ShaderMaterial({
		uniforms: {
			groundMap: {
				type: 't',
				value: null,
			},
			groundMapHigh: {
				type: 't',
				value: null,
			},
			skyboxTexture: {
				value: null,
			},
		},
		vertexShader: `
			varying vec3 vPos;
			varying vec3 vNormal;
			varying vec2 vUv;
			void main() {
				vNormal = normalize((modelMatrix * vec4(normal, 0.0)).xyz);
				vPos = (modelMatrix * vec4(position, 1.0)).xyz;
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position-normal*0., 1.0 );
			}`,
		fragmentShader: `
		
			varying vec3 vPos;
			varying vec3 vNormal;
			varying vec2 vUv;

			vec3 invLightDir = vec3(0.585, 0.728, 0.385);
			float groundSize = 75.0;
			uniform sampler2D groundMap;
			uniform sampler2D groundMapHigh;
			uniform samplerCube skyboxTexture;


			void main() {
				vec3 pos = vPos;
				//pos.y += 0.5;
				vec3 camPos = cameraPosition;
				//camPos.y += 0.5;
				vec3 rayDiff = pos - cameraPosition;
				vec3 rayDir = normalize(rayDiff);
				
				vec3 color = vec3(0.0, 0.0, 0.0);
				float mist = 0.0;
				vec3 reflection;
				vec2 uv;

				vec3 normal = vNormal;

				if (abs(rayDiff.x)+abs(rayDiff.y)+abs(rayDiff.z) > 0.)
				{

					reflection = reflect(rayDir, normalize(normal));
					vec3 reflectionColor = textureCube(skyboxTexture, reflection).rgb;


					// probably smoothstep here will be better to make horizon edge in reflections smoother
					float distance = -(pos.y) / reflection.y;
					uv = (reflection.xz * distance + pos.xz) / 10.0;
					vec3 uvc = vec3(uv, 0.0);
				
					if (reflection.y < 0.)
					{
						reflection = reflection * distance + pos;
						if (abs(reflection.x) < 5.0 && abs(reflection.z) < 5.0){
							reflection.z *= -1.;
							color = vec3(0.25, 0.25, 0.25);//vec3(reflection.xz, 0.0) * 0.005 + vec3(0.5, 0.5, 0.0);
							vec2 centeredUV = reflection.xz / 10.0;
							color = texture(groundMap, centeredUV + vec2(0.5, 0.5)).rgb;

							float lodT = (1.-smoothstep(0.0, 0.3, abs(centeredUV.x))) * 
										(1.-smoothstep(0.0, 0.3, abs(centeredUV.y)));

							color = mix(texture(groundMapHigh, centeredUV + vec2(0.5, 0.5)).rgb,color, 1.-lodT);

							float minStep = 0.35;
							float maxStep = 0.5;
							float mask = (1.-smoothstep(minStep, maxStep, abs(centeredUV.x))) * 
										(1.-smoothstep(minStep, maxStep, abs(centeredUV.y)));
							color = mix(color, reflectionColor, 1.-mask);
						}
						else
							color = reflectionColor;//vec3(0.5, 0.55, 0.75);//uvc * 2. + vec3(0.5, 0.5, 0.0);
					}
					else
					{
						color = reflectionColor;
					}
					float maskEdge = (1.-smoothstep(0.35, 0.5, abs(vUv.x-0.5))) * 
										(1.-smoothstep(0.4, 0.5, abs(vUv.y-0.5)));
					color = mix(color, vec3(0.25, 0.25, 0.25), 1.-maskEdge);

				}

				//color *= vec3(0.7, 0.5, 0.99);

				gl_FragColor = vec4( color*0.5, 1.);
				#include <tonemapping_fragment>
				#include <colorspace_fragment>
			}
		`
	});



















function loadAssets(scene) {
	assets.skyboxTexture = new EXRLoader().load(
		'/textures/background/skybox_ground.exr',
		(texture) => {
			texture.mapping = THREE.EquirectangularReflectionMapping;
			scene.background = texture;
			scene.environment = texture;
		},
		undefined,
		(error) => {
			console.error('Error loading EXR texture:', error);
		}
	);
}

onMounted(() => {
	const cleanup = initThreeJS();
	
	return () => {
		if (cleanup) cleanup();
	};
});
</script>

<template>
	<div class="text-center mb-6">
		<h1 class="mb-4">Three.js Project Template</h1>
		<p class="text-base-content/70">
			This is a minimal Three.js setup with a rotating cube. Use this as a starting point for your projects.
		</p>
	</div>

	<div 
		ref="canvasContainer" 
		class="w-full bg-base-200 rounded-lg overflow-hidden shadow-lg"
		style="min-height: 600px; max-height: 70vh;"
	/>
</template>

<style scoped lang="scss">
// Canvas container styles
</style>

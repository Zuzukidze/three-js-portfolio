<script setup>
import { onMounted, ref } from 'vue';
import { Scene, PerspectiveCamera, WebGLRenderer, BoxGeometry, MeshStandardMaterial, Mesh, DirectionalLight, AmbientLight, Color } from 'three';

const canvasContainer = ref(null);

const initThreeJS = () => {
	if (!canvasContainer.value) return;

	// Camera
	const width = canvasContainer.value.clientWidth;
	const height = canvasContainer.value.clientHeight;
	const camera = new PerspectiveCamera(75, width / height, 0.1, 100);
	camera.position.z = 3;

	// Renderer
	const renderer = createRenderer();
	renderer.setSize(width, height);

	const scene = createScene();

	// Resize
	const handleResize = () => {
		const newWidth = canvasContainer.value.clientWidth;
		const newHeight = canvasContainer.value.clientHeight;
		camera.aspect = newWidth / newHeight;
		camera.updateProjectionMatrix();
		renderer.setSize(newWidth, newHeight);
	};

	window.addEventListener('resize', handleResize);


	// Render loop
	const animate = () => renderer.render(scene, camera);
	renderer.setAnimationLoop(animate);

	// Dispose
	return () => {
		window.removeEventListener('resize', handleResize);
		renderer.setAnimationLoop(null);
		renderer.dispose();
	};
};

function createRenderer() {
	const renderer = new WebGLRenderer({ antialias: true });
	renderer.setPixelRatio(window.devicePixelRatio);
	canvasContainer.value.appendChild(renderer.domElement);
	return renderer;
}

function createScene() {
	const scene = new Scene();
	scene.background = new Color(0x111122);
	// Test mesh
	const geometry = new BoxGeometry(1, 1, 1);
	const material = new MeshStandardMaterial({ color: 0x00ff88 });
	const cube = new Mesh(geometry, material);
	scene.add(cube);

	cube.onBeforeRender = () => {
		cube.rotation.x += 0.01;
		cube.rotation.y += 0.01;
	};

	// Lights
	const light = new DirectionalLight(0xffffff, 1);
	light.position.set(5, 5, 5);
	scene.add(light);

	const ambientLight = new AmbientLight(0xffffff, 0.5);
	scene.add(ambientLight);
	return scene;
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
		<h1 class="mb-4">Project Template</h1>
	</div>

	<div 
		ref="canvasContainer" 
		class="w-full bg-base-200 rounded-lg overflow-hidden shadow-lg"
		style="min-height: 40vh;"
	/>
</template>

<style scoped lang="scss">
// Canvas container styles
</style>

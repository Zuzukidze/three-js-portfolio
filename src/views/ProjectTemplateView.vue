<script setup>
import ProjectTemplate from '@/demos/project-template/ProjectTemplate.vue';
</script>

<template>
	<div class="container-center">
		<ProjectTemplate />

		<div class="mt-6 text-center">
			<router-link :to="{ name: 'home' }" class="btn btn-primary">
				Return
			</router-link>
		</div>
	</div>
</template>

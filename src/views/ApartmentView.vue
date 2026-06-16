<script setup>
import Apartment from '@/demos/apartment/Apartment.vue';
</script>

<template>
	<div class="container-center">
		<Apartment />

		<div class="mt-6 text-center">
			<router-link :to="{ name: 'home' }" class="btn btn-primary">
				Return
			</router-link>
		</div>
	</div>
</template>

import HomeView from '@/views/HomeView.vue';

export default [
	{
		path: '/',
		name: 'home',
		component: HomeView,
		meta: { title: 'Home' },
	},
	{
		path: '/preview',
		name: 'componentsPreview',
		// Lazy-loaded route
		component: () => import('@/views/PreviewView.vue'),
		meta: { title: 'Components Preview' },
	},
	{
		path: '/project-template',
		name: 'projectTemplate',
		// Lazy-loaded route
		component: () => import('@/views/ProjectTemplateView.vue'),
		meta: { title: 'Project Template' },
	},
	{
		path: '/apartment',
		name: 'apartment',
		// Lazy-loaded route
		component: () => import('@/views/ApartmentView.vue'),
		meta: { title: 'Apartment' },
	},
	{
		// 404 fallback
		path: '/:pathMatch(.*)*',
		name: 'notFound',
		component: () => import('@/views/NotFoundView.vue'),
		meta: { title: '404 Not Found' },
	}
];

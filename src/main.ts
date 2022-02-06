import App from './App.svelte';

const app = new App({
	target: document.body,
	props: {
		recipeYaml: "/brioche.yaml"
	}
});

export default app;
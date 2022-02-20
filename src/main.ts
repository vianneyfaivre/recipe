import App from './App.svelte';

// Get the html container where the app will be loaded into
const containerId = "recipe-v2";
const container: HTMLElement = document.getElementById(containerId);
if(!container) {
	throw Error(`No HTML with id ${containerId} found`);
}

// Get the path to the recipe
const recipeYamlAttrId = "data-yaml-path"
const recipeYaml = container.getAttribute(recipeYamlAttrId);
if(!recipeYaml) {
	throw Error(`No attribute ${recipeYamlAttrId} found`);
}

// Bootstrap the svelte app!
const app = new App({
	target: container,
	props: {
		recipeYaml: recipeYaml
	}
});

export default app;
import App from './App.svelte';
import { mount } from "svelte";
import { DEV } from 'virtual:build-info';
import { yamlPathFromRecipePath } from './util/recipe-path';
import { preserveYamlParam } from './util/dev-links';

// Get the html container where the app will be loaded into
const containerId = "recipe-v2";
const container = document.getElementById(containerId);
if(!container) {
	throw Error(`No HTML with id ${containerId} found`);
}

// Get the path to the recipe
const recipeYamlAttrId = "data-yaml-path"
let recipeYaml = container.getAttribute(recipeYamlAttrId);

// Dev only: allow switching the recipe file via ?yaml=<file> (used by the dev
// top bar), or via a blog-style path like /recettes/glacage (so ingredient links
// such as /recettes/glacage?sr=Rocher work on localhost without changing the URI)
if (DEV) {
	const yamlParam = new URLSearchParams(window.location.search).get("yaml");
	if (yamlParam) {
		recipeYaml = `/${yamlParam}`;
	} else {
		recipeYaml = yamlPathFromRecipePath(window.location.pathname) ?? recipeYaml;
	}
}

if(!recipeYaml) {
	throw Error(`No attribute ${recipeYamlAttrId} found`);
}

// Bootstrap the svelte app!
const app = mount(App, {
	target: container,
	props: {
		recipeYaml: recipeYaml
	}
});

// Dev only: keep the ?yaml= param on same-page links (?sr=...) so they reload
// the currently selected recipe instead of the default one
if (DEV) {
	document.addEventListener('click', (e) => {
		const anchor = (e.target as HTMLElement).closest?.('a[href]');
		if (!anchor) return;
		const href = anchor.getAttribute('href');
		if (!href) return;
		const rewritten = preserveYamlParam(href, window.location.href);
		if (rewritten !== href) {
			anchor.setAttribute('href', rewritten);
		}
	});
}

export default app;
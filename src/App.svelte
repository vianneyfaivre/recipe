<script lang="ts">
	import * as jsyaml from "js-yaml";
	import { onMount } from 'svelte';
	import type { PageDataDTO } from "./model/yaml";
	import Error from "./pages/Error.svelte";
	import WholeRecipe from "./pages/WholeRecipe.svelte";

	export let recipeYaml: string;

	let pageData: PageDataDTO;
	let selectedRecipeId: string;
	let error: string;

	async function loadYaml(path: string) {

		const response = await fetch(path);

		if(!response.ok) {
			error = `Cause : HTTP ${response.status} - ${response.statusText} - ${path}`;
			return;
		}

		const yaml = await response.text();
		let json: any;
		try {
			json = await jsyaml.load(yaml);
		} catch(e) {
			error = `Cause : le fichier "${path}" est invalide : ${e.reason}`;
			return;
		}

		// Convert object to Map
		json.recipes = new Map(Object.entries(json.recipes));

		return json;
	}
	
	onMount(async () => {

		// Load yaml data
		pageData = await loadYaml(recipeYaml); 

		// Extract the selected recipe from the URL anchor (if any)
		const anchor = decodeURI(window.location.hash.split("#")[1]);
  		if(anchor) {
			for(const recipeId of pageData.recipes.keys()) {
				if(recipeId === anchor) {
					selectedRecipeId = recipeId;
				}
			}
		}

		// Select the first recipe by default
		selectedRecipeId = selectedRecipeId || pageData.recipes.keys().next().value;
	});

</script>

<main>

	<article class="post h-entry recette">

		{#if !!error}
			
			<Error {error} />

		{:else if pageData && selectedRecipeId}

			<WholeRecipe {pageData} {selectedRecipeId} />

		{:else}

			<!-- No loading screen -->
		{/if}
		
	</article>
</main>
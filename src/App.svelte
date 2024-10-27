<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageDataDTO } from "./model/recipe";
	import Error from "./pages/Error.svelte";
	import WholeRecipe from "./pages/WholeRecipe.svelte";
	import { anchorManager } from "./util/anchor-manager";
	import { loadYaml } from './util/yaml-loader';

	export let recipeYaml: string;

	let pageData: PageDataDTO;
	let selectedRecipeId: string;
	let error: string;

	onMount(async () => {

		// Load yaml data
		try {
			pageData = await loadYaml(recipeYaml); 
		} catch(e) {
			console.error(e);
			error = e;
			return;
		}

		// Extract the selected recipe from the URL anchor (if any)
		const anchor = anchorManager.get();
		let found = false;
		
  		if(anchor) {
			for(const recipeId of pageData.recipes.keys()) {
				if(recipeId === anchor) {
					selectedRecipeId = recipeId;
					found = true;
				}
			}
		}

		if(found === false) {
			anchorManager.remove();
		}

		// Select the first recipe by default
		selectedRecipeId = selectedRecipeId || pageData.recipes.keys().next().value;

		console.debug("Recipe loaded!");
	});

</script>

{#if !!error}
	
	<Error {error} />

{:else if pageData && selectedRecipeId}

	<WholeRecipe {pageData} {selectedRecipeId} />

{:else}

	<!-- No loading screen -->
{/if}
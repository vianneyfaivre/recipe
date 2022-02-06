<script lang="ts">
	import * as jsyaml from "js-yaml";
	import { onMount } from 'svelte';
	import type { PageDataDTO } from "./model/yaml";
	import Recipe from "./components/Recipe.svelte";

	export let recipeYaml: string;

	let pageData: PageDataDTO;
	let selectedRecipeId: string;
	let error;

	async function loadYaml(path: string) {

		const response = await fetch(path);

		if(!response.ok) {
			error = `Cause : HTTP ${response.status} - ${response.statusText} - ${path}`;
			return;
		}

		const yaml = await response.text();
		let json;
		try {
			json = await jsyaml.load(yaml);
		} catch(e) {
			error = `Cause : le fichier "${path}" est invalide : ${e.reason}`;
			return;
		}

		// Convert object to Map
		json.recettes = new Map(Object.entries(json.recettes));

		return json;
	}
	
	onMount(async () => {

		// Load yaml data
		pageData = await loadYaml(recipeYaml); 

		// Select the first recipe by default
		selectedRecipeId = pageData.recettes.keys().next().value;
	});

	function onVarianteButtonClick(recipeId: string) {

		console.info(`Selected ${recipeId}`);
		selectedRecipeId = recipeId;
	}

</script>

<main>

	<article class="post h-entry recette">

		{#if !!error}

			<header>
				<h1 class="post-title p-name">Erreur !</h1>
			</header>

			<div class="post-content e-content">
				<p>Une erreur est survenue.</p>
				<p>{error}</p>
			</div>

		{:else if pageData && selectedRecipeId}

					<header>
						<h1 class="post-title p-name">{pageData.title}</h1>
					</header>
				
					<div class="post-content e-content">
				
						<div class="variantes-tabs">
						
							{#each [...pageData.recettes] as [recipeId, recipe]}
								<button 
									class="variantes-btn" 
									class:active={recipeId === selectedRecipeId}
									on:click={e => onVarianteButtonClick(recipeId)}
								>
									{recipeId}
								</button>
							{/each}

						</div>

						{#each [...pageData.recettes] as [recipeId, recipe]}

							<div class:hidden={recipeId !== selectedRecipeId}>
								<Recipe {pageData} {recipeId} {recipe} />
							</div>
						
						{/each}
				
					</div>


		{:else}

			<!-- No loading screen -->
		{/if}
		
	</article>
</main>
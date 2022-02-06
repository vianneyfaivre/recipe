<script lang="ts">
	import * as jsyaml from "js-yaml";
	import { onMount } from 'svelte';
	import type { PageDataDTO } from "./model";
	import Recipe from "./Recipe.svelte";

	export let recipeYaml: string;

	let pageData: PageDataDTO;
	let selectedRecipeId: string;

	async function loadYaml(path: string) {

		const response = await fetch(path);
		const yaml = await response.text();

		// TODO: basic error handling: fetch, parse yaml

		const json = await jsyaml.load(yaml);

		// Convert object to Map
		json.recettes = new Map(Object.entries(json.recettes));

		return json;
	}
	
	onMount(async () => {

		// TODO: loading...

		// Load yaml data
		pageData = await loadYaml(recipeYaml); 
		console.info(pageData)

		// Select the first recipe by default
		selectedRecipeId = pageData.recettes.keys().next().value;
	});

	function onVarianteButtonClick(recipeId: string) {

		console.info(`Selected ${recipeId}`);
		selectedRecipeId = recipeId;
	}

</script>

{#if pageData && selectedRecipeId}

	<main>

		<article class="post h-entry recette">

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
		
		</article>
	</main>

{:else}

	<p>loading...</p>

{/if}

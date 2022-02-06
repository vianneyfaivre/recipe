<script lang="ts">
	import * as jsyaml from "js-yaml";
	import { onMount } from 'svelte';
	import type { PageDataDTO } from "./model/yaml";
	import Recipe from "./components/Recipe.svelte";
	import { fade } from 'svelte/transition';

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
		json.recipes = new Map(Object.entries(json.recipes));

		return json;
	}
	
	onMount(async () => {

		// Load yaml data
		pageData = await loadYaml(recipeYaml); 

		// Select the first recipe by default
		selectedRecipeId = pageData.recipes.keys().next().value;
	});

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
		
				<div class="variations-tabs">
				
					{#each [...pageData.recipes] as [recipeId, recipe]}
						<button 
							class="variations-btn" 
							class:active={recipeId === selectedRecipeId}
							on:click={e => selectedRecipeId = recipeId}
						>
							{recipeId}
						</button>
					{/each}

				</div>

				{#each [...pageData.recipes] as [recipeId, recipe]}

					{#if recipeId === selectedRecipeId}

						<div transition:fade="{{ duration: 300 }}">
							<Recipe {pageData} {recipeId} {recipe} />
						</div>

					{/if}
				
				{/each}
		
			</div>

		{:else}

			<!-- No loading screen -->
		{/if}
		
	</article>
</main>
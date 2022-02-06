<script lang="ts">
	import * as jsyaml from "js-yaml";
	import { onMount } from 'svelte';
	import type { PageData, Recipe } from "./model";

	export let pageData: PageData;
	export let selectedRecipeId: string;

	async function loadYaml(path: string) {

		const response = await fetch(path);
		const yaml = await response.text();

		const json = await jsyaml.load(yaml);

		// Convert object to Map
		json.recettes = new Map(Object.entries(json.recettes));

		return json;
	}
	
	onMount(async () => {

		pageData = await loadYaml("/simple.yaml"); 
		console.info(pageData)

		// Select the first recipe by default
		selectedRecipeId = pageData.recettes.keys().next().value;

		console.info(selectedRecipeId)
	});

	function onVarianteButtonClick(recipeId: string, recipe: Recipe) {

		console.info(`Selected ${recipeId}`);
		selectedRecipeId = recipeId;

		// Update URL hash
		if (pageData.recettes.length > 1) {
			window.location.replace("#" + recipeId)
		}  

		// Remove all buttons highlighting
		for (const variante in pageData.recettes) {
	//		const varianteId = variante[0];
	//		varianteButton.classList.remove "active"
		}
			

		// Highlight the clicked button
	//	btn.classList.add "active"

		// Hide all variantes
	//	hideElements variantes

		// Display the right variante
	//	variante = document.getElementById varianteId+"-variante"
	//	changeDisplay variante, 'block'

		// Hide pictures title when there are none for the selected variante
		//variantePictures = document.getElementById varianteId + "-pictures"
		//if variantePictures
		//	hasPictures = variantePictures.getElementsByClassName("recipe-picture").length > 0	
		//	if !hasPictures
		//	changeDisplay variantePictures, 'none'
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
						<button class="variantes-btn" on:click={e => onVarianteButtonClick(recipeId, recipe)}>{recipeId}</button>
					{/each}

				</div>

				{#each [...pageData.recettes] as [recipeId, recipe]}

					<div id="{recipeId}-variante" class="variante-whole" class:hidden={recipeId !== selectedRecipeId} itemscope itemtype="https://schema.org/Recipe">
			
						<div id="{recipeId}-whole" class="recette-whole"> 
			
							<div class="ingredients-panel"> <!-- INGREDIENTS -->


								<h4 id="{recipeId}-title" class="variante-title">
									🥕 Ingrédients 

									{#if recipe.yield}
										pour 
										<span itemprop="recipeYield">
											<span id="{recipeId}-yield" data-originalValue="{ recipe.yield }">{ recipe.yield }</span>
											{recipe.yieldType}
										</span>
									{/if}
								</h4>

								<ul id="{recipeId}-ingredients" class="variante-ingredients">
									{#each Object.values(recipe.ingredients) as ingredient }
									
									<!--
										
										{% capture ingredientQte }
											<span class="ingredient-qte-fixed" data-originalValue="{ingredient.qte}">
												{ingredient.qte}
											</span>
										{% endcapture }
									
									
										{#if  ingredient.variable == true }
											{% capture ingredientQte }
												<input class="ingredient-qte-variable" 
														type="number" 
														data-varianteId="{recipeId}"
														data-originalValue="{ ingredient.qte }"
														value="{ingredient.qte}"
														min="1"
												/>
											{% endcapture }
										{/if}

									-->
									
										<li itemprop="recipeIngredient">
										{#if ingredient.qte }
									
											{#if ingredient.lien }
												<a href="{ ingredient.lien }">{ ingredient.nom }</a> : { ingredient.qte } { ingredient.unite || '' }
											{:else}
												{ ingredient.nom } : { ingredient.qte } { ingredient.unite || '' }
											{/if}
										{:else}
											
											{#if ingredient.lien }
												<a href="{ ingredient.lien }">{ ingredient.nom }</a>
											{:else}
												{ ingredient.nom }
											{/if}
										{/if}
										</li>
									
									{/each}
									</ul>

							</div> <!-- INGREDIENTS -->
			
			
							<div class="etapes-panel"> <!-- STEPS -->

								<h3 class="variante-subtitles" id="{recipeId}-subtitle" itemprop="name"> 
									🎺 { pageData.title } - { recipeId } 🎺
								</h3>

								{#if pageData.preconditions || pageData.withYeast }
									<h4>📜 Préambule</h4>
									
									<ul>
									
									{#if pageData.preconditions}
										{#each Object.values(pageData.preconditions) as precondition }
											<li>{ precondition }</li>
										{/each}
									{/if}
										
									{#if pageData.withYeast }
										<li><a href="/cuisine/levure">Activer la levure</a></li>
									{/if}

									</ul>
								{/if}

									
								{#if recipe.preconditions }
									<div id="{recipeId}-preconditions" class="variante-preconditions">

										<h4>📜 Préambule</h4>
										
										<ul>
											
											{#each recipe.preconditions as precondition }
											<li itemprop="recipeInstructions">{ precondition }</li>
											{/each}
											
										</ul>
									</div>
								{/if}

								<div id="{recipeId}-etapes" class="variante-etapes">

									{#each Object.values(recipe.etapes) as step}
										<h4>TODO {step.label}</h4>
										<ol>
										{#each Object.values(step.details) as detail }
											
											<li itemprop="recipeInstructions">
												{#if typeof detail === "string" }
													{ detail }
												{:else }
													<a href="{ detail.link }">{ detail.label }</a>
												{/if}
											</li>
											
										{/each}
										</ol>
									{/each}
								</div>

							</div> <!-- STEPS -->
							
						</div>
					
						<div class="bottom-panel"> <!-- BOTTOM -->

							{#if pageData.notes }
								<h4>📝 Notes</h4>
								<ul>
								{#each pageData.notes as note }

									{#if typeof note === "string" }
										<li>{ note }</li>
									{:else}
										<li><a href="{ note.link }">{ note.label }</a></li>
									{/if}
								{/each}
								</ul>
							{/if}

							{#if pageData.variantes }
								<h4>💡 Variantes</h4>
								<ul class="no-dots">
								{#each pageData.variantes as variante }
									<li>
										{#if variante.todo }
											<input type="checkbox" />
										{:else}
											<input type="checkbox" checked="checked" />
										{/if}
										
										{ variante.label }
									</li>
								{/each}
								</ul>
							{/if}

							<!--
							<div id="{recette[0]}-pictures" class="variante-pictures">

								<h4>📷 Photos</h4>

								<div class="recipe-pictures">

									
									{% assign pictures = site.static_files | where: "isRecipePic", true }

									{#each picture in pictures }

										{% assign name = picture.name | split: '.' }

										{% assign nameMatches = false }
										{#if recette[0] == 'Classique' }
											{% assign nameMatches = true }
										{% elsif name[0] contains recette[0] }
											{% assign nameMatches = true }
										{/if}
										

										{#if picture.path contains page.title and nameMatches == true }
										
											<img 
												src="{ picture.path }" 
												itemprop='image'
												class="recipe-picture" 
												width="100" 
												alt="{ name[0] }" 
												title="{ name[0] }" />
										{/if}

									{/each}

								</div>

							</div>-->

						</div> <!-- BOTTOM -->
						
					</div>
				{/each}
		
			</div>
		
		</article>
	</main>

{:else}

	<p>loading...</p>

{/if}

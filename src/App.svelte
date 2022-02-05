<script lang="ts">
	import * as jsyaml from "js-yaml";
	import { onMount } from 'svelte';

	export let recipes: any;

	async function loadYaml(path) {

		const response = await fetch(path);
		const yaml = await response.text();

		return await jsyaml.load(yaml);
	}
	
	onMount(async () => {
		recipes = await loadYaml("/creme-patissiere.yaml"); 
		console.info(recipes)
	});

</script>

{#if recipes}

	<main>

		<article class="post h-entry recette">

			<header>
				<h1 class="post-title p-name">{recipes.title}</h1>
			</header>
		
			<div class="post-content e-content">
		
				<div class="variantes-tabs">
				
					{#each Object.entries(recipes.recettes) as recipe}
						<button class="variantes-btn">{recipe[0]}</button>
					{/each}

				</div>

				{#each Object.entries(recipes.recettes) as recipe }

					<div id="{recipe[0]}-variante" class="variante-whole hidden" itemscope itemtype="https://schema.org/Recipe">
			
						<div id="{recipe[0]}-whole" class="recette-whole"> 
			
							<div class="ingredients-panel"> <!-- INGREDIENTS -->


								<h4 id="{recipe[0]}-title" class="variante-title">
									🥕 Ingrédients 

									{#if recipe[1].yield}
										pour 
										<span itemprop="recipeYield">
											<span id="{recipe[0]}-yield" data-originalValue="{ recipe[0].yield }">{ recipe[0].yield }</span>
											{recipe[1].yieldType}
										</span>
									{/if}
								</h4>

								<ul id="{recipe[0]}-ingredients" class="variante-ingredients">
									{#each recipe[1].ingredients as ingredient }
									
									<!--
										
										{% capture ingredientQte %}
											<span class="ingredient-qte-fixed" data-originalValue="{ingredient.qte}">
												{ingredient.qte}
											</span>
										{% endcapture %}
									
									
										{#if  ingredient.variable == true }
											{% capture ingredientQte %}
												<input class="ingredient-qte-variable" 
														type="number" 
														data-varianteId="{recipe[0]}"
														data-originalValue="{ ingredient.qte }"
														value="{ingredient.qte}"
														min="1"
												/>
											{% endcapture %}
										{/if}

									-->
									
										<li itemprop="recipeIngredient">
										{#if ingredient.qte }
									
											{#if ingredient.lien }
												<a href="{ ingredient.lien }">{ ingredient.nom }</a> : { ingredient.qte } { ingredient.unite }
											{:else}
												{ ingredient.nom } : { ingredient.qte } { ingredient.unite }
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
							</div> <!-- STEPS -->
			
						</div>
					
						<div class="bottom-panel"> <!-- BOTTOM -->
						</div> <!-- BOTTOM -->
						
					</div>
				{/each}
		
			</div>
		
		</article>
	</main>

{:else}

	<p>loading...</p>

{/if}

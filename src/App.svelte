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
		recipes = await loadYaml("/simple.yaml"); 
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
											<span id="{recipe[0]}-yield" data-originalValue="{ recipe[1].yield }">{ recipe[1].yield }</span>
											{recipe[1].yieldType}
										</span>
									{/if}
								</h4>

								<ul id="{recipe[0]}-ingredients" class="variante-ingredients">
									{#each Object.values(recipe[1].ingredients) as ingredient }
									
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
														data-varianteId="{recipe[0]}"
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

								<h3 class="variante-subtitles" id="{recipe[0]}-subtitle" itemprop="name"> 
									🎺 { recipes.title } - { recipe[0] } 🎺
								</h3>

								{#if recipes.preconditions || recipes.withYeast }
									<h4>📜 Préambule</h4>
									
									<ul>
									
									{#if recipes.preconditions}
										{#each Object.values(recipes.preconditions) as precondition }
											<li>{ precondition }</li>
										{/each}
									{/if}
										
									{#if recipes.withYeast }
										<li><a href="/cuisine/levure">Activer la levure</a></li>
									{/if}

									</ul>
								{/if}

									
								{#if recipe[1].preconditions }
									<div id="{recipe[0]}-preconditions" class="variante-preconditions">

										<h4>📜 Préambule</h4>
										
										<ul>
											
											{#each recipe[1].preconditions as precondition }
											<li itemprop="recipeInstructions">{ precondition }</li>
											{/each}
											
										</ul>
									</div>
								{/if}

								<div id="{recipe[0]}-etapes" class="variante-etapes">

									{#each Object.values(recipe[1].etapes) as step}
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

							{#if recipes.notes }
								<h4>📝 Notes</h4>
								<ul>
								{#each recipes.notes as note }

									{#if typeof note === "string" }
										<li>{ note }</li>
									{:else}
										<li><a href="{ note.link }">{ note.label }</a></li>
									{/if}
								{/each}
								</ul>
							{/if}

							{#if recipes.variantes }
								<h4>💡 Variantes</h4>
								<ul class="no-dots">
								{#each recipes.variantes as variante }
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

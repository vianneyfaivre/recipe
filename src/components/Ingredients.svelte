<script lang="ts">
    import type { PageDataDTO, RecipeDTO } from "../model/recipe";
    import Ingredient from "./Ingredient.svelte";
    import NutritionFacts from "./NutritionFacts.svelte";
    import Yield from "./Yield.svelte";
    
    export let pageData: PageDataDTO;
    export let recipe: RecipeDTO;

    function updateIngredientsQuantities(originalQuantity: number, newQuantity: number) {

        // Update other ingredients quantity
        recipe.ingredients.forEach(ingredient => {

            const ingredientOldQty = ingredient.qty;
            
            // ingredients may not be quantifiable
            if(!ingredientOldQty) {
                console.debug(`Ignored "${ingredient.label}"`);
                return;
            }

            const ingredientNewQty: number = +((ingredientOldQty * newQuantity) / originalQuantity).toFixed(1);
            console.debug(`Changed "${ingredient.label}" from ${ingredientOldQty} to ${ingredientNewQty}`);

            ingredient.updatedQty = ingredientNewQty;
        });

        // Update recipe yield
        if(recipe.yyield) {

            const oldYield: number = recipe.yyield;
            const newYield: number = +((oldYield * newQuantity) / originalQuantity).toFixed(1);
    
            if(!!newYield) {
                console.debug(`Changed yield to "${newYield}"`);
                recipe.yyield = newYield;
                return;
            } else {
                console.debug(`Invalid yield value ${newYield}`);
            }
        }

        // Triggers a refresh of the whole list of ingredients 
        recipe = recipe;
    }
</script>

<h4 class="variante-title">
    🥕 Ingrédients 

    {#if recipe.yyield}
        <Yield {recipe} />
    {/if}
</h4>

<ul class="variante-ingredients">
    {#each recipe.ingredients as ingredient }
    
        <Ingredient 
            {ingredient} 
            on:quantityChange={e => updateIngredientsQuantities(e.detail.originalQty, e.detail.newQty)} 
        />
    {/each}
</ul>

<NutritionFacts {recipe} {pageData} />
<script lang="ts">
    import type { RecipeDTO } from "../model/recipe";
    import Ingredient from "./Ingredient.svelte";
    import Yield from "./Yield.svelte";
    
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
                recipe.updatedYield = newYield;
                return;
            } else {
                console.debug(`Invalid yield value ${newYield}`);
            }
        }

        // Triggers a refresh of the whole list of ingredients 
        recipe = recipe;
    }
</script>


<style>
    h3 {
        text-align: center;
        width: 100%;
        padding-right: 0;
        padding-left: 0;
    }
</style>

<h3 class="info-title">
    🥕 Ingrédients 

    {#if recipe.yyield}
        <Yield {recipe} />
    {/if}
</h3>

<ul class="info-title">
    {#each recipe.ingredients as ingredient }
    
        <Ingredient 
            {ingredient} 
            on:quantityChange={e => updateIngredientsQuantities(e.detail.originalQty, e.detail.newQty)} 
        />
    {/each}
</ul>
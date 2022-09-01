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

            let ingredientNewQty: number = +((ingredientOldQty * newQuantity) / originalQuantity).toFixed(1);

            // avoid using 0 because it is considered false in the template part...
            if(ingredientNewQty == 0) {
                ingredientNewQty = 0.1;
            }

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
            } else {
                console.debug(`Invalid yield value ${newYield}`);
                recipe.updatedYield = 0;
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

<section>
    <h3>
        🥕 Ingrédients

        {#if recipe.yyield}
            <Yield {recipe} />
        {/if}

        🥕
    </h3>

    <ul>
        {#each recipe.ingredients as ingredient }
        
            <Ingredient 
                {ingredient} 
                on:quantityChange={e => updateIngredientsQuantities(e.detail.originalQty, e.detail.newQty)} 
            />
        {/each}
    </ul>
</section>
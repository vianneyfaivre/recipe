<script lang="ts">
    import type { RecipeDTO } from "../model/yaml";
    import Ingredient from "./Ingredient.svelte";
    
    export let recipeId: string; 
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
        const oldYield: number = recipe.yield;
        const newYield: number = +((oldYield * newQuantity) / originalQuantity).toFixed(1);

        if(!!newYield) {
            console.debug(`Changed yield to "${newYield}"`);
            recipe.updatedYield = newYield;
            return;
        } else {
            console.debug(`Invalid yield value ${newYield}`);
        }

        // Triggers a refresh of the whole list of ingredients 
        recipe = recipe;
    }
  
</script>

<h4 id="{recipeId}-title" class="variante-title">
    🥕 Ingrédients 

    {#if recipe.yield}
        pour 
        <span itemprop="recipeYield">
            <span id="{recipeId}-yield" data-originalValue="{ recipe.yield }">
                { recipe.updatedYield || recipe.yield }
            </span>
            {recipe.yieldType || ''}
        </span>
    {/if}
</h4>

<ul id="{recipeId}-ingredients" class="variante-ingredients">
    {#each recipe.ingredients as ingredient }
    
        <Ingredient 
            {ingredient} 
            on:quantityChange={e => updateIngredientsQuantities(e.detail.originalQty, e.detail.newQty)} 
        />
    {/each}
</ul>
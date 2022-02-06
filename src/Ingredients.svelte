<script lang="ts">
    import type { RecipeDTO } from "./model";
    import Ingredient from "./Ingredient.svelte";
    
    export let recipeId: string; 
    export let recipe: RecipeDTO;

    function updateIngredientsQuantities(originalQuantity: number, newQuantity: number) {

        // Update other ingredients quantity
        recipe.ingredients.forEach(ingredient => {

            const ingredientOldQty = ingredient.qte;
            
            // ingredients may not be quantifiable
            if(!ingredientOldQty) {
                console.debug(`Ignored "${ingredient.nom}"`);
                return;
            }

            const ingredientNewQty: number = +((ingredientOldQty * newQuantity) / originalQuantity).toFixed(2);
            console.debug(`Changed "${ingredient.nom}" from ${ingredientOldQty} to ${ingredientNewQty}`);

            ingredient.updatedQty = ingredientNewQty;
        })

        // Triggers a refresh of the whole list of ingredients 
        recipe = recipe;

        // Update recipe yield
        /*recipeYield = document.getElementById("#{varianteId}-yield")
        if recipeYield
            oldYield = +recipeYield.getAttribute("data-originalValue")
            newYield = ((oldYield * variableNewValue) / variableOriginalValue).toFixed(2)
            if !isNaN(newYield)
            recipeYield.innerHTML = newYield
        */
    }
  
</script>

<h4 id="{recipeId}-title" class="variante-title">
    🥕 Ingrédients 

    {#if recipe.yield}
        pour 
        <span itemprop="recipeYield">
            <span id="{recipeId}-yield" data-originalValue="{ recipe.yield }">{ recipe.yield }</span>
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
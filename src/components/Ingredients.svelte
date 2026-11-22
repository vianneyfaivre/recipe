<script lang="ts">
    import type { RecipeDTO } from "../model/recipe";
    import Ingredient from "./Ingredient.svelte";
    import Yield from "./Yield.svelte";
    
    interface Props {
        recipe: RecipeDTO;
    }

    let { recipe }: Props = $props();

    // Svelte 5 does not track mutations on class instances, so the updated
    // values are mirrored into reactive state to trigger re-renders.
    let updatedQuantities = $state<Record<number, number>>({});
    let updatedYield = $state<number>();
    let updatedYieldType = $state<string>();

    function updateIngredientsQuantities(originalQuantity: number, newQuantity: number) {

        // Update other ingredients quantity
        recipe.ingredients.forEach((ingredient, index) => {

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
            updatedQuantities[index] = ingredientNewQty;
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

            updatedYield = recipe.updatedYield;
            updatedYieldType = recipe.updatedYieldType;
        }
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
            <Yield {recipe} {updatedYield} {updatedYieldType} />
        {/if}

        🥕
    </h3>

    <ul>
        {#each recipe.ingredients as ingredient, index }
        
            <Ingredient 
                {ingredient} 
                updatedQty={updatedQuantities[index]}
                onQuantityChange={(originalQty, newQty) => updateIngredientsQuantities(originalQty, newQty)} 
            />
        {/each}
    </ul>
</section>
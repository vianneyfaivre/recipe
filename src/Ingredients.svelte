<script lang="ts">
    import type { RecipeDTO } from "./model";
    import Ingredient from "./Ingredient.svelte";
    
    export let recipeId: string; 
    export let recipe: RecipeDTO;
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
    {#each Object.values(recipe.ingredients) as ingredient }
    
        <Ingredient {ingredient} />
    {/each}
</ul>
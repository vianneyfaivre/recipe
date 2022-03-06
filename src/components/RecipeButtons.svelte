<script lang="ts">
    import type { RecipeDTO } from "../model/yaml";
    import { setAnchor } from "../util/anchor-manager";

    export let recipes: Map<string, RecipeDTO>;
    export let selectedRecipeId: string;

    const hasVariations: boolean = recipes.size > 1;

    function onVariationClick(recipeId: string): void {
        selectedRecipeId = recipeId;
        setAnchor(recipeId);
    }
</script>

<div class="variantes-tabs">
        
    {#each [...recipes] as [recipeId, _]}
        <button 
            class="variantes-btn" 
            class:active={recipeId === selectedRecipeId}
            on:click={_ => onVariationClick(recipeId)}
        >
            {recipeId}
        </button>
    {/each}
</div>
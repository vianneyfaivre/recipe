<script lang="ts">
    import type { RecipeDTO } from "../model/yaml";
    import { anchorManager } from "../util/anchor-manager";

    export let recipes: Map<string, RecipeDTO>;
    export let selectedRecipeId: string;

    function onVariationClick(recipeId: string): void {
        selectedRecipeId = recipeId;
        anchorManager.set(recipeId);
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
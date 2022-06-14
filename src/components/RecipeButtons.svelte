<script lang="ts">
    import type { RecipeDTO } from "../model/recipe";
    import { anchorManager } from "../util/anchor-manager";

    export let recipes: Map<string, RecipeDTO>;
    export let selectedRecipeId: string;

    function onVariationClick(recipeId: string): void {
        selectedRecipeId = recipeId;
        anchorManager.set(recipeId);
    }
</script>

<style>
.variations-tabs {  
    display: flex; 
    justify-content: center; 
    margin-bottom: 15px; 
    background-color: var(--bg-color); 
    border-bottom: 5px solid var(--border-color); 
}

.variations-tabs button { 
    background-color: inherit; 
    border: none; 
    cursor: pointer; 
    padding: 10px; 
    padding-top: 13px;
    font-size: 13px; 
    transition: 0.3s; 
}

.variations-tabs button:hover { background-color: var(--border-color); }

.variations-tabs button.active { 
    background-color: var(--border-color); 
    border-top-left-radius: 20px; 
    border-top-right-radius: 20px; 
}
</style>

<div class="variations-tabs">
        
    {#each [...recipes] as [recipeId, _]}
        <button 
            class:active={recipeId === selectedRecipeId}
            on:click={_ => onVariationClick(recipeId)}
        >
            {recipeId}
        </button>
    {/each}
</div>
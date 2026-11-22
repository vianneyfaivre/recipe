<script lang="ts">
    import type { RecipeDTO } from "../model/recipe";
    import { anchorManager } from "../util/anchor-manager";

    interface Props {
        recipes: Map<string, RecipeDTO>;
        selectedRecipeId: string;
    }

    let { recipes, selectedRecipeId = $bindable() }: Props = $props();

    function onVariationClick(recipeId: string): void {
        selectedRecipeId = recipeId;
        anchorManager.set(recipeId);
    }
</script>

<style>
nav {  
    display: flex; 
    justify-content: center; 
    flex-wrap: wrap;
    background-color: var(--header-bg-color); 
    border-bottom: 5px solid var(--border-color); 
}

nav button { 
    background-color: inherit; 
    border: none; 
    cursor: pointer; 
    padding: 13px 10px 10px 10px; 
    margin: 0px 2px;
    font-size: 15px; 
    transition: 0.3s; 
}

@media all and (max-width: 700px) { 
    nav button {  
        margin: 0;
        font-size: 12px; 
    }
}

nav button:hover { 
    background-color: var(--border-color); 
}

nav button.active { 
    color: var(--behind-bg-color);
    font-weight: bold;
    background-color: var(--border-color); 
    border-top-left-radius: 20px; 
    border-top-right-radius: 20px; 
}
</style>

<nav>   
    {#each [...recipes] as [recipeId, _]}
        <button 
            class:active={recipeId === selectedRecipeId}
            onclick={_ => onVariationClick(recipeId)}
        >
            {recipeId}
        </button>
    {/each}
</nav>
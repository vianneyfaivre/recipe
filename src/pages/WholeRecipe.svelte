<script lang="ts">
    import Recipe from "../components/Recipe.svelte";
	import { fade } from 'svelte/transition';
    import type { PageDataDTO } from "../model/yaml";
    import { setAnchor } from "../util/anchor-manager";

    export let pageData: PageDataDTO;
    export let selectedRecipeId: string;

    const hasVariations: boolean = pageData.recipes.size > 1;

    function onVariationClick(recipeId: string): void {
        selectedRecipeId = recipeId;
        setAnchor(recipeId);
    }
</script>

<header>
    <h1 class="post-title p-name">{pageData.title}</h1>
</header>

<div class="post-content e-content">

    {#if hasVariations}
        <div class="variantes-tabs">
        
            {#each [...pageData.recipes] as [recipeId, _]}
                <button 
                    class="variantes-btn" 
                    class:active={recipeId === selectedRecipeId}
                    on:click={_ => onVariationClick(recipeId)}
                >
                    {recipeId}
                </button>
            {/each}
        </div>
    {/if}

    {#each [...pageData.recipes] as [recipeId, recipe]}

        {#if recipeId === selectedRecipeId}

            <div in:fade="{{ duration: 500 }}">
                <Recipe {pageData} {recipeId} {recipe} />
            </div>

        {/if}
    
    {/each}

</div>
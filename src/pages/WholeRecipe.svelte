<script lang="ts">
    import Recipe from "../components/Recipe.svelte";
	import { fade } from 'svelte/transition';
    import type { PageDataDTO } from "../model/yaml";

    export let pageData: PageDataDTO;
    export let selectedRecipeId: string;
</script>

<header>
    <h1 class="post-title p-name">{pageData.title}</h1>
</header>

<div class="post-content e-content">

    <div class="variantes-tabs">
    
        {#each [...pageData.recipes] as [recipeId, _]}
            <button 
                class="variantes-btn" 
                class:active={recipeId === selectedRecipeId}
                on:click={_ => selectedRecipeId = recipeId}
            >
                {recipeId}
            </button>
        {/each}

    </div>

    {#each [...pageData.recipes] as [recipeId, recipe]}

        {#if recipeId === selectedRecipeId}

            <div transition:fade="{{ duration: 300 }}">
                <Recipe {pageData} {recipeId} {recipe} />
            </div>

        {/if}
    
    {/each}

</div>
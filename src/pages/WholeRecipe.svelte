<script lang="ts">
    import Recipe from "../components/Recipe.svelte";
	import { fade } from 'svelte/transition';
    import type { PageDataDTO } from "../model/recipe";
    import RecipeButtons from "../components/RecipeButtons.svelte";

    export let pageData: PageDataDTO;
    export let selectedRecipeId: string;

    const hasVariations: boolean = pageData.recipes.size > 1;
</script>

<style>
    :root {
        --bg-color: #C0E7F3;
        --bg2-color: #EFF9FC;
        --bg3-color: #CCCEF74D;

        --border-color: #7075CC;
    }

    :global(h1) { 
        font-size: 45px; 
        text-align: center; 
        text-decoration: 3px underline wavy var(--border-color);
        padding-bottom: 35px; 
        margin-bottom: 0px; 
        background-color: var(--bg-color);
    }

    :global(h2) {
        font-size: 35px;
        padding-left: 5px;
        padding-bottom: 3px;
        border-bottom: 3px solid var(--border-color);
        text-align: center;
    }

    :global(h3) {
        font-size: 20px;
        padding: 0px 5px 3px 5px;
        border-bottom: 1px solid var(--border-color);
        display: inline-block;
    }

    @media all and (max-width: 700px) { 
        :global(h3) {
            display: block;
            text-align: center;
        }
    }

    .post-content {
        background-color: var(--bg2-color);
    }
</style>

<header>
    <h1 class="post-title p-name">{pageData.title}</h1>
</header>

<div class="post-content e-content">

    {#if hasVariations}
        <RecipeButtons recipes={pageData.recipes} bind:selectedRecipeId={selectedRecipeId} />
    {/if}

    {#each [...pageData.recipes] as [recipeId, recipe]}

        {#if recipeId === selectedRecipeId}

            <div in:fade="{{ duration: 500 }}">
                <Recipe {pageData} {recipeId} {recipe} />
            </div>

        {/if}
    
    {/each}

</div>
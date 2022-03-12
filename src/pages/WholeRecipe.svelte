<script lang="ts">
    import Recipe from "../components/Recipe.svelte";
	import { fade } from 'svelte/transition';
    import type { PageDataDTO } from "../model/recipe";
    import RecipeButtons from "../components/RecipeButtons.svelte";

    export let pageData: PageDataDTO;
    export let selectedRecipeId: string;

    const hasVariations: boolean = pageData.recipes.size > 1;
</script>

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
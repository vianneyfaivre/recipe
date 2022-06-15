<script lang="ts">
    import Recipe from "../components/Recipe.svelte";
	import { fade } from 'svelte/transition';
    import type { PageDataDTO } from "../model/recipe";
    import RecipeButtons from "../components/RecipeButtons.svelte";
    import Page from "../layout/Page.svelte";

    export let pageData: PageDataDTO;
    export let selectedRecipeId: string;

    const hasVariations: boolean = pageData.recipes.size > 1;
</script>

<Page title={pageData.title}>

    {#if hasVariations}
        <RecipeButtons recipes={pageData.recipes} bind:selectedRecipeId={selectedRecipeId} />
    {/if}

    {#each [...pageData.recipes] as [recipeId, recipe]}

        {#if recipeId === selectedRecipeId}
            <Recipe {pageData} {recipeId} {recipe} />
        {/if}
    {/each}
</Page>
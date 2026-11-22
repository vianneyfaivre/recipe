<script lang="ts">
    import Recipe from "../components/Recipe.svelte";
    import type { PageDataDTO } from "../model/recipe";
    import RecipeButtons from "../components/RecipeButtons.svelte";
    import Page from "../layout/Page.svelte";

    interface Props {
        pageData: PageDataDTO;
        selectedRecipeId: string;
    }

    let { pageData, selectedRecipeId = $bindable() }: Props = $props();

    let hasVariations: boolean = $derived(pageData.recipes.size > 1);
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
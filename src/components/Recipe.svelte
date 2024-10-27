<script lang="ts">
import Ingredients from "./Ingredients.svelte";
import type { PageDataDTO, RecipeDTO } from "../model/recipe";
import Notes from "./Notes.svelte";
import Steps from "./Steps.svelte";
import Variations from "./Variations.svelte";
import Photos from "./Photos.svelte";
import NutritionFacts from "./NutritionFacts.svelte";
import { fade } from 'svelte/transition';

export let pageData: PageDataDTO;
export let recipeId: string;
export let recipe: RecipeDTO;

function displayBottomPanel(): boolean {

    const hasNotes = pageData.notes.length > 0 || recipe.notes.length > 0;
    const hasVariations = pageData.variations.length > 0;
    const hasPictures = recipe.pictures > 0;

    return hasNotes || hasVariations || hasPictures;
}
</script>

<style>
    .recette-whole { 
        padding-bottom: 15px; 
        display: flex; 
        flex-flow: row nowrap; 
        align-items: flex-start;
    }
    
    .ingredients-panel { 
        flex-grow: 0;
        flex-shrink: 1;
        flex-basis: min-content;

        white-space: nowrap;  /* the whole block will be as large as the longest ingredient */
        
        position: sticky;
        top: 15px;

        margin: 10px 10px;
        padding: 15px 10px 0 10px;

        border: 2px solid var(--border-color);
        border-radius: 20px;

        background-color: var(--content-side-bg-color);
    }

    h2.steps-title {
        display: none;
    } 
    
    .steps-panel { 
        padding: 0 10px; 
        margin: 10px 0 0 0;
        flex: 1 1 auto; 
    }

    .bottom-panel {
        background-color: var(--footer-bg-color);
        border-top: 5px solid var(--border-color);
        padding: 15px 10px 10px 10px; 
    }
     
    @media all and (max-width: 700px) { 

        .recette-whole { 
            margin-top: 15px; 
            flex-direction: column-reverse; /* "reverse" so the ingredients are displayed first */
        }

        h2.steps-title {
            display: block;
        } 
        
        .steps-panel { 
            border-left: 0; 
            padding-left: 0px; 
            padding-right: 0px; 
            margin: 0px; 
            flex: 1 1 auto;
        } 

        .ingredients-panel { 
            position: relative;
            top: 0; 
            width: 85%;
            margin: auto;

            white-space: normal;  /* re-enable line breaking because block width is already set */
        }

    }
</style>

<div in:fade|global="{{ duration: 500 }}" itemscope itemtype="https://schema.org/Recipe">			

    <section class="recette-whole">
        
        <div class="steps-panel"> 
            
            <h2 class="steps-title">
                📖 Étapes 📖
            </h2>

            <Steps {pageData} {recipe} /> 
        </div> 

        <div class="ingredients-panel">

            <Ingredients {recipe} />
        </div>
        
    </section>

    {#if displayBottomPanel() === true}
        <aside class="bottom-panel"> 

            <Notes notes={ [].concat(pageData.notes).concat(recipe.notes)} />

            <Variations variations={pageData.variations} />

            <NutritionFacts {recipe} />

            <Photos {recipeId} {recipe} title={pageData.title} />

        </aside>
    {/if}

</div>
<script lang="ts">
import Ingredients from "./Ingredients.svelte";
import type { PageDataDTO, RecipeDTO } from "../model/recipe";
import Notes from "./Notes.svelte";
import Steps from "./Steps.svelte";
import Variations from "./Variations.svelte";
import Photos from "./Photos.svelte";
import NutritionFacts from "./NutritionFacts.svelte";

export let pageData: PageDataDTO;
export let recipeId: string;
export let recipe: RecipeDTO;
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
        white-space: nowrap; 
        
        position: sticky;
        top: 15px;

        margin-right: 15px;
        padding: 15px 10px 0 10px;

        border: 2px solid var(--border-color);
        border-radius: 20px;

        background-color: var(--bg3-color);
    }

    h2.steps-title {
        display: none;
    } 
    
    .steps-panel { 
        padding-left: 10px; 
        padding-right: 10px; 
        flex: 1 1 auto; 
    }

    .bottom-panel {

        border-top: 5px solid var(--border-color);
        padding-top: 15px;
    }
     
    @media all and (max-width: 700px) { 

        .recette-whole { 
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
            margin-bottom: 15px;
        }

    }
</style>

<div id="{recipeId}-variante" class="variante-whole" itemscope itemtype="https://schema.org/Recipe">			

    <div id="{recipeId}-whole" class="recette-whole">
        
        <div class="steps-panel"> 
            <h2 class="steps-title">
                📖 Étapes 📖
            </h2>

            <Steps {pageData} {recipe} /> 
        </div> 

        <div class="ingredients-panel">

            <Ingredients {recipe} />
        </div>
        
    </div>

    <div class="bottom-panel"> 

        <Notes notes={pageData.notes} />

        <Variations variations={pageData.variations} />

        <NutritionFacts {recipe} />

        <Photos {recipeId} {recipe} title={pageData.title} />

    </div>
    
</div>
<script lang="ts">
import Ingredients from "./Ingredients.svelte";
import type { PageDataDTO, RecipeDTO } from "../model/yaml";
import Notes from "./Notes.svelte";
import Steps from "./Steps.svelte";
import Variations from "./Variations.svelte";
import Photos from "./Photos.svelte";
import RecipeSubtitle from "./RecipeSubtitle.svelte";

export let pageData: PageDataDTO;
export let recipeId: string;
export let recipe: RecipeDTO;

const hasVariations: boolean = pageData.recipes.size > 1;
</script>

<div id="{recipeId}-variante" class="variante-whole" itemscope itemtype="https://schema.org/Recipe">
			
    <div id="{recipeId}-whole" class="recette-whole"> 

        <div class="ingredients-panel">

            <Ingredients {pageData} {recipe} />
        </div>

        <div class="etapes-panel"> 

            {#if hasVariations} 
                <RecipeSubtitle recipeTitle={pageData.title} variationTitle={recipeId} />
            {/if}

            <Steps {pageData} {recipeId} {recipe} /> 
        </div> 
        
    </div>

    <div class="bottom-panel"> 

        <Notes notes={pageData.notes} />

        <Variations variations={pageData.variations} />

        <Photos {recipeId} {recipe} title={pageData.title} />

    </div>
    
</div>
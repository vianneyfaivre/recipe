<script lang="ts">
import Ingredients from "./Ingredients.svelte";
import type { PageDataDTO, RecipeDTO } from "../model/yaml";
import Notes from "./Notes.svelte";
import Steps from "./Steps.svelte";
import Variations from "./Variations.svelte";
import Photos from "./Photos.svelte";

export let pageData: PageDataDTO;
export let recipeId: string;
export let recipe: RecipeDTO;
</script>

<div id="{recipeId}-variante" class="variante-whole" itemscope itemtype="https://schema.org/Recipe">
			
    <div id="{recipeId}-whole" class="recette-whole"> 

        <div class="ingredients-panel">

            <Ingredients {recipe} />
        </div>


        <div class="etapes-panel"> 

            <Steps {pageData} {recipeId} {recipe} /> 
        </div> 
        
    </div>

    <div class="bottom-panel"> 

        <Notes notes={pageData.notes} />

        <Variations variations={pageData.variations} />

        <Photos {recipeId} {recipe} title={pageData.title} />

    </div>
    
</div>
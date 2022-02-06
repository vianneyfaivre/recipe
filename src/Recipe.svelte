<script lang="ts">
import Ingredients from "./Ingredients.svelte";
import type { PageDataDTO, RecipeDTO } from "./model";
import Notes from "./Notes.svelte";
import Steps from "./Steps.svelte";
import Variations from "./Variations.svelte";

export let pageData: PageDataDTO;
export let recipeId: string;
export let recipe: RecipeDTO;
</script>

<div id="{recipeId}-variante" class="variante-whole" itemscope itemtype="https://schema.org/Recipe">
			
    <div id="{recipeId}-whole" class="recette-whole"> 

        <div class="ingredients-panel">

            <Ingredients {recipeId} {recipe} />
        </div>


        <div class="etapes-panel"> 

            <Steps {pageData} {recipeId} {recipe} /> 
        </div> 
        
    </div>

    <div class="bottom-panel"> 

        <Notes notes={pageData.notes} />

        <Variations variations={pageData.variantes} />

    </div>
    
</div>
<script lang="ts">
    import type { IngredientDTO } from "./model";
    
    export let ingredient: IngredientDTO;

    function displayQuantity(): string {

        if(!!ingredient.qte) {
            return `: ${ingredient.qte} ${ingredient.unite || ''}`;
        }
        return '';
    }
</script>

<!--
    
    {% capture ingredientQte }
        <span class="ingredient-qte-fixed" data-originalValue="{ingredient.qte}">
            {ingredient.qte}
        </span>
    {% endcapture }


    {#if  ingredient.variable == true }
        {% capture ingredientQte }
            <input class="ingredient-qte-variable" 
                    type="number" 
                    data-varianteId="{recipeId}"
                    data-originalValue="{ ingredient.qte }"
                    value="{ingredient.qte}"
                    min="1"
            />
        {% endcapture }
    {/if}

-->

<li itemprop="recipeIngredient">

    {#if ingredient.lien }
        <a href="{ ingredient.lien }">{ ingredient.nom }</a> {displayQuantity()}
    {:else}
        { ingredient.nom } {displayQuantity()}
    {/if}
</li>

<script lang="ts">
    import type { IngredientDTO } from "./model";
    
    export let ingredient: IngredientDTO;
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
    {#if ingredient.qte }

        {#if ingredient.lien }
            <a href="{ ingredient.lien }">{ ingredient.nom }</a> : { ingredient.qte } { ingredient.unite || '' }
        {:else}
            { ingredient.nom } : { ingredient.qte } { ingredient.unite || '' }
        {/if}
    {:else}
        
        {#if ingredient.lien }
            <a href="{ ingredient.lien }">{ ingredient.nom }</a>
        {:else}
            { ingredient.nom }
        {/if}
    {/if}
</li>

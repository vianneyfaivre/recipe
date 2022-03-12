<script lang="ts">
    import type { IngredientDTO } from "../model/recipe";	
    import { createEventDispatcher } from 'svelte';

    export let ingredient: IngredientDTO;
    
    const dispatch = createEventDispatcher();

	function onQuantityChange(originalQty: number, e: any) {

        const newQty: number = +e.target.value;

        console.debug(`Firing quantityChange event ${originalQty} => ${newQty}`);

		dispatch('quantityChange', {
			originalQty: originalQty,
            newQty: newQty
		});
	}
</script>

<li itemprop="recipeIngredient">

    {#if ingredient.link }
        <a href="{ ingredient.link }">{ ingredient.label }</a> 
    {:else}
        { ingredient.label } : 

        {#if ingredient.variable === true }
        
            <input class="ingredient-qte-variable" 
                type="number" 
                value="{ingredient.updatedQty || ingredient.qty}"
                min="1"
                on:input={e => onQuantityChange(ingredient.qty, e)}
            />
        {:else if ingredient.qty }
            {ingredient.updatedQty || ingredient.qty}
        {:else }
            à souhait    
        {/if}

    {/if}

    {ingredient.unit || ''}
</li>

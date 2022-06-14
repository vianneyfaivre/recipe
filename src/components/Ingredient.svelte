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

<style>
    input { 
        width: 4em; 
        border: 0;
        background-color: var(--bg3-color);
    }
</style>

<li itemprop="recipeIngredient">

    {#if ingredient.link }
     
        <a href="{ ingredient.link }">
            { ingredient.label }
            { ingredient.updatedQty || ingredient.qty || '' }
            { ingredient.unit || '' }
        </a>

    {:else}
        { ingredient.label } : 

        {#if ingredient.variable === true }
        
            <input
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

        { ingredient.unit || '' }
    {/if}

</li>

<script lang="ts">
    import type { IngredientDTO } from "../model/recipe";	
    import { createEventDispatcher } from 'svelte';

    export let ingredient: IngredientDTO;
    
    const dispatch = createEventDispatcher();

	function onQuantityChange(originalQty: number, e: any) {

        const newQty: number = +e.target.value;

        if(newQty <= 0) {
            console.debug(`Invalid quantity ${newQty}`);
            return;
        }

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
        background-color: var(--content-main-bg-color);
        border-radius: 20px;
        border: 2px solid var(--border-color);
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
                type="text" 
                inputmode="numeric" 
                pattern="[0-9]*"
                value="{ingredient.updatedQty || ingredient.qty}"
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

<script lang="ts">
    import type { IngredientDTO } from "../model/yaml";	
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

    {#if ingredient.lien }
        <a href="{ ingredient.lien }">{ ingredient.nom }</a> 
    {:else}
        { ingredient.nom }
    {/if}

    {#if ingredient.variable === true }

        <input class="ingredient-qte-variable" 
            type="number" 
            value="{ingredient.qte}"
            min="1"
            on:input={e => onQuantityChange(ingredient.qte, e)}
        />
    {:else if ingredient.qte }
        : {ingredient.updatedQty || ingredient.qte} {ingredient.unite || ''}
    {/if}
    
</li>

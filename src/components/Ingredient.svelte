<script lang="ts">
    import type { IngredientDTO } from "../model/recipe";	

    interface Props {
        ingredient: IngredientDTO;
        updatedQty?: number;
        onQuantityChange?: (originalQty: number, newQty: number) => void;
    }

    let { ingredient, updatedQty, onQuantityChange }: Props = $props();

    // Re-read the (mutated) ingredient whenever the updated quantity changes,
    // because Svelte 5 does not track mutations on class instances.
    let display = $derived.by(() => ({
        qty: updatedQty || ingredient.updatedQty || ingredient.qty,
        unit: ingredient.unit || ''
    }));

	function handleQuantityChange(originalQty: number, e: any) {

        const newQty: number = +e.target.value;

        if(newQty <= 0) {
            console.debug(`Invalid quantity ${newQty}`);
            return;
        }

        console.debug(`Firing quantityChange event ${originalQty} => ${newQty}`);

		onQuantityChange?.(originalQty, newQty);
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
            { display.qty || '' }
            { display.unit }
        </a>

    {:else}
        { ingredient.label } : 

        {#if ingredient.variable === true }
        
            <input
                type="text" 
                inputmode="numeric" 
                pattern="[0-9]*"
                value={display.qty}
                oninput={e => handleQuantityChange(ingredient.qty!, e)}
            />
        {:else if ingredient.qty }
            {display.qty}
        {:else }
            à souhait    
        {/if}

        { display.unit }
    {/if}

</li>

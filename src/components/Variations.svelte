<script lang="ts">
    import type { VariationDTO } from "../model/recipe";
    
    export let variations: VariationDTO[];
</script>

<style>
    ul { 
        list-style-type: none; 
        margin-left: 10px; 
    }
</style>

{#if variations && variations.length > 0 }
<section>
    <h3>💡 Variantes</h3>
    
    <ul>
    {#each variations as variation }
        <li>
            <input type="checkbox" checked={!variation.todo} />
            
            { variation.label }
        </li>
    {/each}
    </ul>
</section>
{/if}
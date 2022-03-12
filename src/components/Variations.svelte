<script lang="ts">
    import type { VariationDTO } from "../model/recipe";
    
    export let variations: VariationDTO[];
</script>


{#if variations && variations.length > 0 }
    <h4>💡 Variantes</h4>
    
    <ul class="no-dots">
    {#each variations as variation }
        <li>
            <input type="checkbox" checked={!variation.todo} />
            
            { variation.label }
        </li>
    {/each}
    </ul>
{/if}
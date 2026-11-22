<script lang="ts">
    import type { VariationDTO } from "../model/recipe";
    
    interface Props {
        variations: VariationDTO[];
    }

    let { variations }: Props = $props();
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
            
            {#if variation.link }
                <a href={variation.link}>{ variation.label }</a>
            {:else}
                { variation.label }
            {/if}
        </li>
    {/each}
    </ul>
</section>
{/if}
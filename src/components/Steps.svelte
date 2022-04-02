<script lang="ts">
    import { Option, PageDataDTO, RecipeDTO } from "../model/recipe";
    
    export let pageData: PageDataDTO;
    export let recipe: RecipeDTO;

    const hasYeast: boolean = recipe.hasOption(Option.YEAST);
</script>

{#if pageData.preconditions || hasYeast }
    <h4>📜 Préambule</h4>
    
    <ul>
    
        {#if pageData.preconditions}
            {#each Object.values(pageData.preconditions) as precondition }
                <li>{ precondition }</li>
            {/each}
        {/if}
            
        {#if hasYeast }
            <li><a href="/cuisine/levure">Activer la levure</a></li>
        {/if}

    </ul>
{/if}

    
{#if recipe.preconditions }
    <div class="variante-preconditions">

        <h4>📜 Préambule</h4>
        
        <ul>
            
            {#each recipe.preconditions as precondition }
            <li itemprop="recipeInstructions">{ precondition }</li>
            {/each}
            
        </ul>
    </div>
{/if}

<div class="variante-steps">

    {#each Object.values(recipe.steps) as step}
        <h4>{step.emoji || '📜'} {step.label}</h4>
        <ol>
        {#each Object.values(step.details) as detail }
            
            <li itemprop="recipeInstructions">
                {#if typeof detail === "string" }
                    { detail }
                {:else }
                    <a href="{ detail.link }">{ detail.label }</a>
                {/if}
            </li>
            
        {/each}
        </ol>
    {/each}
</div>
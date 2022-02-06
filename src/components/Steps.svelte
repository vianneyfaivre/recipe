<script lang="ts">
    import type { PageDataDTO, RecipeDTO } from "../model/yaml";
    
    export let pageData: PageDataDTO;
    export let recipeId: string;
    export let recipe: RecipeDTO;
</script>

<h3 class="variante-subtitles" id="{recipeId}-subtitle" itemprop="name"> 
    🎺 { pageData.title } - { recipeId } 🎺
</h3>

{#if pageData.preconditions || pageData.withYeast }
    <h4>📜 Préambule</h4>
    
    <ul>
    
        {#if pageData.preconditions}
            {#each Object.values(pageData.preconditions) as precondition }
                <li>{ precondition }</li>
            {/each}
        {/if}
            
        {#if pageData.withYeast }
            <li><a href="/cuisine/levure">Activer la levure</a></li>
        {/if}

    </ul>
{/if}

    
{#if recipe.preconditions }
    <div id="{recipeId}-preconditions" class="variante-preconditions">

        <h4>📜 Préambule</h4>
        
        <ul>
            
            {#each recipe.preconditions as precondition }
            <li itemprop="recipeInstructions">{ precondition }</li>
            {/each}
            
        </ul>
    </div>
{/if}

<div id="{recipeId}-steps" class="variante-steps">

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
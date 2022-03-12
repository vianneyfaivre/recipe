<script lang="ts">
    import type { RecipeDTO } from "../model/recipe";

    export let recipe: RecipeDTO;
</script>

pour 
<span itemprop="recipeYield">
    <span data-originalValue="{ recipe.yield }">
        { recipe.updatedYield || recipe.yield }
    </span>
    {recipe.yieldType || ''}
</span>
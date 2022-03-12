<script lang="ts">
    import type { RecipeDTO } from "../model/recipe";

    export let recipe: RecipeDTO;
</script>

pour 
<span itemprop="recipeYield">
    <span data-originalValue="{ recipe.updatedYield }">
        { recipe.updatedYield }
    </span>
    {recipe.yieldType || ''}
</span>
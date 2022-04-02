<script lang="ts">
    import type { RecipeDTO } from "../model/recipe";

    export let recipe: RecipeDTO;
</script>

pour 
<span itemprop="recipeYield">
    <span data-originalValue="{ recipe.yyield }">
        { recipe.yyield }
    </span>
    {recipe.yieldType || ''}
</span>
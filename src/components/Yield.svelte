<script lang="ts">
    import type { RecipeDTO } from "../model/recipe";

    interface Props {
        recipe: RecipeDTO;
        updatedYield?: number;
        updatedYieldType?: string;
    }

    let { recipe, updatedYield, updatedYieldType }: Props = $props();
</script>

pour 
<span itemprop="recipeYield">
    <span>
        { updatedYield ?? recipe.updatedYield }
    </span>
    {updatedYieldType ?? recipe.updatedYieldType ?? ''}
</span>
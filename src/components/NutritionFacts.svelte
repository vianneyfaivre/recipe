<script lang="ts">
    import { HydrationDTO, nutritionDB, NutritionFactsDTO } from "../model/nutrition";

    import { IngredientDTO, Option, RecipeDTO } from "../model/recipe";

    interface Props {
        recipe: RecipeDTO;
    }

    let { recipe }: Props = $props();

    let recipeNutritionFacts: NutritionFactsDTO | undefined = $derived.by(() => {

        if(computeRecipeNutrition(recipe) !== true) {
            console.debug("Ingredients are not eligible for Nutrition Facts panel");
            return undefined;
        }

        // For each ingredient, compute the nutrition facts (ratio qty vs 100 gr) 
        recipe
            .ingredients
            .forEach(computeIngredientRatio);

        // Get recipe overall nutrition facts
        return getNutritionFacts(recipe);
    });

    let hydrationRatio: number | undefined = $derived.by(() => {

        if(!recipeNutritionFacts) {
            return undefined;
        }

        if(recipe.hasOption(Option.HYDRATION) === true) {

            // Compute hydration ratio 
            return computeHydrationRatio(recipe);
        }

        return undefined;
    });

    function isEgg(ingredient: IngredientDTO): boolean {

        return ingredient.label.toLowerCase() == "oeufs";
    }

    function getQuantity(ingredient: IngredientDTO): number {

        const qty = ingredient.qty ?? 0;

        return isEgg(ingredient) ? qty * 50 : qty;
    }

    function computeRecipeNutrition(recipe: RecipeDTO): boolean {

        // Yield is mandatory
        if(!recipe.yyield || !recipe.yieldType) {
            console.debug("Missing yield information");
            return false;
        }

        // Collect nutrition facts for every ingredient
        const entries = 
                recipe
                    .ingredients
                    .map(ingr => {

                        const key = ingr.label.toLowerCase();

                        // Unit is mandatory and must be in grams
                        // Not applicable for eggs
                        if(ingr.unit !== "gr" && !isEgg(ingr)) {

                            console.debug(`Unit for '${key}' must be 'gr', not '${ingr.unit}'`);
                            return undefined;
                        }

                        // Get from DB
                        const nutritionPer100gr = nutritionDB.get(key);
                        if(!nutritionPer100gr) {
                            console.debug(`Missing nutrition for '${key}'`);
                            return undefined;
                        }

                        // Assign nutrition facts to the ingredient
                        ingr.nutritionFactsPer100gr = nutritionPer100gr;

                        return [key, nutritionPer100gr] as [string, NutritionFactsDTO];
                    });

        // All ingredients must be in the Nutrition DB
        const eligible = entries.every(e => e !== undefined); 
        if(!eligible) {
            return false;
        }

        return true;
    }

    function getNutritionFacts(recipe: RecipeDTO): NutritionFactsDTO {

        // Sum up all nutrition facts to get the recipe overall nutrition facts
        const recipeNutritionFacts = recipe.ingredients
                                        .map(i => i.nutritionFacts!)
                                        .reduce((prev, next, __, ___) => {

                                            const energy = prev.energy + next.energy;
                                            const carbs = prev.carbs + next.carbs;
                                            const fat = prev.fat + next.fat;
                                            const protein = prev.protein + next.protein;
                                            const salt = prev.salt + next.salt;

                                            return new NutritionFactsDTO(energy, carbs, fat, protein, salt, HydrationDTO.NOT_APPLICABLE);
                                        });

        return recipeNutritionFacts;
    }

    function computeHydrationRatio(recipe: RecipeDTO) {

        const liquidIngredientsGrams: number = recipe.ingredients
                                                        .filter(i => i.nutritionFacts!.viscosity === HydrationDTO.LIQUID)
                                                        .map(getQuantity)
                                                        .reduce((prev, next, __, ___) => prev + next);

        const solidIngredientsGrams: number = recipe.ingredients
                                                        .filter(i => i.nutritionFacts!.viscosity === HydrationDTO.SOLID)
                                                        .map(getQuantity)
                                                        .reduce((prev, next, __, ___) => prev + next);

        console.debug(`Liquid=${liquidIngredientsGrams} / Solid=${solidIngredientsGrams}`);

        const th = (liquidIngredientsGrams / solidIngredientsGrams) * 100;

        return Math.round(th);
    }

    function computeIngredientRatio(ingredient: IngredientDTO): void {

        const nutritionPer100gr: NutritionFactsDTO = ingredient.nutritionFactsPer100gr!;

        // Get the quantity (default it to 50 grams for eggs)
        const qty = getQuantity(ingredient);

        // Calculate weighed nutrition facts 
        let energy = (qty * nutritionPer100gr.energy) / 100;
        let carbs = (qty * nutritionPer100gr.carbs) / 100;
        let fat = (qty * nutritionPer100gr.fat) / 100;
        let protein = (qty * nutritionPer100gr.protein) / 100;
        let salt = (qty * nutritionPer100gr.salt) / 100;

        // Divide by the number of servings (guaranteed to be set when nutrition facts are valid)
        const servings: number = recipe.yyield!;
        energy = energy / servings;
        carbs = carbs / servings;
        fat = fat / servings;
        protein = protein / servings;
        salt = salt / servings;

        // Assign nutrition facts to the ingredient
        ingredient.nutritionFacts = new NutritionFactsDTO(energy, carbs, fat, protein, salt, nutritionPer100gr.viscosity);
    }
</script>


{#if recipeNutritionFacts }
<section>
    <h3>
        📚 Valeurs Nutritionnelles (par portion)
    </h3>

    <ul>

        <li>Énergie : {recipeNutritionFacts.energy.toFixed(0)} kCal</li>
        <li>Matières Grasses : {recipeNutritionFacts.fat.toFixed(0)} gr</li>
        <li>Glucides : {recipeNutritionFacts.carbs.toFixed(0)} gr</li>
        <li>Protéines : {recipeNutritionFacts.protein.toFixed(0)} gr</li>
        <li>Sel : {recipeNutritionFacts.salt.toFixed(1)} gr</li>
        {#if hydrationRatio }
            <li>
                🍞 Taux d'hydratation : {hydrationRatio}%
            </li>
        {/if}
    </ul>
</section>
{/if}
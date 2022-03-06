<script lang="ts">
    import { nutritionDB, NutritionFactsDTO, HydrationDTO } from "../data/nutrition";
    import type { IngredientDTO, PageDataDTO, RecipeDTO } from "../model/yaml";

    export let pageData: PageDataDTO;
    export let recipe: RecipeDTO;

    const nutritionFactsValid: boolean = computeRecipeNutrition(recipe);

    let recipeNutritionFacts: NutritionFactsDTO;
    let hydrationRatio: number;

    if(nutritionFactsValid === true) {

        // For each ingredient, compute the nutrition facts (ratio qty vs 100 gr) 
        recipe
            .ingredients
            .forEach(computeIngredientRatio);

        // Get recipe overall nutrition facts
        recipeNutritionFacts = getNutritionFacts(recipe);

        if(pageData.hydrationRatioEnabled === true) {

            // Compute hydration ratio 
            hydrationRatio = computeHydrationRatio(recipe);
        }
    }

    function isEgg(ingredient: IngredientDTO): boolean {

        return ingredient.label.toLowerCase() == "oeufs";
    }

    function getQuantity(ingredient: IngredientDTO): number {
        return isEgg(ingredient) ? ingredient.qty * 50 : ingredient.qty;
    }

    function computeRecipeNutrition(recipe: RecipeDTO): boolean {

        // Yield is mandatory
        if(!recipe.yield || !recipe.yieldType) {
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
                                        .map(i => i.nutritionFacts)
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
                                                        .filter(i => i.nutritionFacts.viscosity === HydrationDTO.LIQUID)
                                                        .map(getQuantity)
                                                        .reduce((prev, next, __, ___) => prev + next);

        const solidIngredientsGrams: number = recipe.ingredients
                                                        .filter(i => i.nutritionFacts.viscosity === HydrationDTO.SOLID)
                                                        .map(getQuantity)
                                                        .reduce((prev, next, __, ___) => prev + next);

        console.debug(`Liquid=${liquidIngredientsGrams} / Solid=${solidIngredientsGrams}`);

        const th = (liquidIngredientsGrams / solidIngredientsGrams) * 100;

        return Math.round(th);
    }

    function computeIngredientRatio(ingredient: IngredientDTO): void {

        const nutritionPer100gr: NutritionFactsDTO = ingredient.nutritionFactsPer100gr;

        // Get the quantity (default it to 50 grams for eggs)
        const qty = getQuantity(ingredient);

        // Calculate weighed nutrition facts 
        let energy = (qty * nutritionPer100gr.energy) / 100;
        let carbs = (qty * nutritionPer100gr.carbs) / 100;
        let fat = (qty * nutritionPer100gr.fat) / 100;
        let protein = (qty * nutritionPer100gr.protein) / 100;
        let salt = (qty * nutritionPer100gr.salt) / 100;

        // Divide by the number of servings
        energy = energy / recipe.yield;
        carbs = carbs / recipe.yield;
        fat = fat / recipe.yield;
        protein = protein / recipe.yield;
        salt = salt / recipe.yield;

        // Assign nutrition facts to the ingredient
        ingredient.nutritionFacts = new NutritionFactsDTO(energy, carbs, fat, protein, salt, nutritionPer100gr.viscosity);
    }
</script>


{#if recipeNutritionFacts }
    <h4 class="variante-title">
        📚 Valeurs Nutritionnelles (par portion)
    </h4>

    <ul class="variante-nutrition">

        <li>Énergie : {recipeNutritionFacts.energy.toFixed(0)} kCal</li>
        <li>Matières Grasses : {recipeNutritionFacts.fat.toFixed(0)} gr</li>
        <li>Glucides : {recipeNutritionFacts.carbs.toFixed(0)} gr</li>
        <li>Protéines : {recipeNutritionFacts.protein.toFixed(0)} gr</li>
        <li>Sel : {recipeNutritionFacts.salt.toFixed(1)} gr</li>
    </ul>
{/if}

{#if hydrationRatio }

    <h4 class="variante-title">
        🍞 Taux d'hydratation : {hydrationRatio}%
    </h4>

{/if}
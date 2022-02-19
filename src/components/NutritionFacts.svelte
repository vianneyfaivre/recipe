<script lang="ts">
    import { nutritionDB, NutritionFactsDTO } from "../data/nutrition";
    import type { IngredientDTO, RecipeDTO } from "../model/yaml";

    export let recipe: RecipeDTO;

    const nutritionFacts: NutritionFactsDTO = getNutritionFacts(recipe);

    function isEgg(ingredient: IngredientDTO): boolean {

        return ingredient.label.toLowerCase() == "oeufs";
    }

    function getNutritionFacts(recipe: RecipeDTO): NutritionFactsDTO | undefined {

        // Yield is mandatory
        if(!recipe.yield || !recipe.yieldType) {
            console.debug("Missing yield information");
            return;
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
                    const nutrition = nutritionDB.get(key);
                    if(!nutrition) {
                        console.debug(`Missing nutrition for '${key}'`);
                        return undefined;
                    }

                    return [key, nutrition] as [string, NutritionFactsDTO];
                });

        const ingredientsNutrition: Map<string, NutritionFactsDTO> = new Map(entries);

        // All ingredients must be in the Nutrition DB
        const eligible = ingredientsNutrition.has(undefined) === false; 
        if(!eligible) {
            return;
        }

        // Calculate recipe nutrition facts
        return recipe
                .ingredients
                .map(ingredient => {

                    const ingredientNutrition = ingredientsNutrition.get(ingredient.label);

                    // Get the quantity (default it to 50 grams for eggs)
                    const qty = isEgg(ingredient) ? ingredient.qty * 50 : ingredient.qty;

                    // Calculate weighed nutrition facts 
                    let energy = (qty * ingredientNutrition.energy) / 100;
                    let carbs = (qty * ingredientNutrition.carbs) / 100;
                    let fat = (qty * ingredientNutrition.fat) / 100;
                    let protein = (qty * ingredientNutrition.protein) / 100;
                    let salt = (qty * ingredientNutrition.salt) / 100;

                    // Divide by the number of servings
                    energy = energy / recipe.yield;
                    carbs = carbs / recipe.yield;
                    fat = fat / recipe.yield;
                    protein = protein / recipe.yield;
                    salt = salt / recipe.yield;
                
                    return new NutritionFactsDTO(energy, carbs, fat, protein, salt);
                })
                .reduce((prev, next, __, ___) => {

                    const energy = prev.energy + next.energy;
                    const carbs = prev.carbs + next.carbs;
                    const fat = prev.fat + next.fat;
                    const protein = prev.protein + next.protein;
                    const salt = prev.salt + next.salt;

                    return new NutritionFactsDTO(energy, carbs, fat, protein, salt);
                });
    }
</script>


{#if nutritionFacts }
    <h4 class="variante-title">
        📚 Valeurs Nutritionnelles (par portion)
    </h4>

    <ul class="variante-nutrition">

        <li>Énergie - {nutritionFacts.energy.toFixed(0)} kCal</li>
        <li>Matières Grasses - {nutritionFacts.fat.toFixed(0)} gr</li>
        <li>Glucides - {nutritionFacts.carbs.toFixed(0)} gr</li>
        <li>Protéines - {nutritionFacts.protein.toFixed(0)} gr</li>
        <li>Sel - {nutritionFacts.salt.toFixed(1)} gr</li>
    </ul>
{/if}
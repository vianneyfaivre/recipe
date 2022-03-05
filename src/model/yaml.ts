/*
 * Can't use default values on attributes because of the use of jsyaml
 */

import type { NutritionFactsDTO } from "../data/nutrition";

export class PageDataDTO {
		
    readonly title: string;
    readonly withYeast: boolean;
    readonly hydrationRatioEnabled: boolean;
    readonly preconditions: string[];
    readonly recipes: Map<string, RecipeDTO>;
    readonly notes: string[] | NoteDTO[];
    readonly variations: VariationDTO[];
}

export class RecipeDTO {

    readonly yield?: number;
    readonly yieldType?: string;
    readonly ingredients: IngredientDTO[];
    readonly preconditions?: string[];
    readonly steps: StepDTO[];

    updatedYield?: number;
    pictures?: number;
}

export class IngredientDTO {

    readonly label: string;
    readonly qty?: number;
    readonly unit?: string;
    readonly variable?: boolean;
    readonly link?: string;

    updatedQty?: number;
    nutritionFactsPer100gr?: NutritionFactsDTO;
    nutritionFacts?: NutritionFactsDTO;
}

export class StepDTO {

    readonly label: string;
    readonly emoji: string;
    readonly details: string | StepDetailDTO[];
}

export class StepDetailDTO {

    readonly label: string;
    readonly link: string;
}

export class NoteDTO {

    readonly label: string;
    readonly link?: string;
}

export class VariationDTO {

    readonly label: string;
    readonly todo: boolean;
}

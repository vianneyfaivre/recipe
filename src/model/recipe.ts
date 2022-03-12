import type { NutritionFactsDTO } from "./nutrition";

export class PageDataDTO {
		
    constructor(
        readonly title: string,
        readonly preconditions: string[],
        readonly recipes: Map<string, RecipeDTO>,
        readonly notes: Array<string | NoteDTO>,
        readonly variations: VariationDTO[]
    ) {}
}

export class RecipeDTO {

    constructor(
        readonly ingredients: IngredientDTO[],
        readonly steps: StepDTO[],
        readonly options: Option[],
        readonly yieldType?: string,
        readonly preconditions?: string[],
        updatedYield?: number,
        readonly pictures?: number,
    ) {}

}

export enum Option {

    YEAST = "YEAST",
    HYDRATION = "HYDRATION",
}

export class IngredientDTO {

    constructor(
        readonly label: string,
        readonly qty?: number,
        readonly unit?: string,
        readonly variable?: boolean,
        readonly link?: string,
    ) {
        this.updatedQty = qty;
    }

    updatedQty?: number;
    nutritionFactsPer100gr?: NutritionFactsDTO;
    nutritionFacts?: NutritionFactsDTO;
}

export class StepDTO {

    constructor(
        readonly label: string,
        readonly emoji: string,
        readonly details: Array<string | StepDetailDTO>
    ) {}
}

export class StepDetailDTO {

    constructor(
        readonly label: string,
        readonly link: string,
    ) {}
}

export class NoteDTO {

    constructor(
        readonly label: string,
        readonly link?: string
    ) {}
}

export class VariationDTO {

    constructor(
        readonly label: string,
        readonly todo: boolean
    ) {}
}
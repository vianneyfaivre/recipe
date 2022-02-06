/*
 * Can't use default values on attributes because of the use of jsyaml
 */

export class PageDataDTO {
		
    readonly title: string;
    readonly withYeast: boolean;
    readonly preconditions: string[];
    readonly recettes: Map<string, RecipeDTO>;
    readonly notes: string[] | NoteDTO[];
    readonly variantes: VariationDTO[];
}

export class RecipeDTO {

    readonly yield?: number;
    readonly yieldType?: string;
    readonly ingredients: IngredientDTO[];
    readonly preconditions?: string[];
    readonly etapes: StepDTO[];
}

export class IngredientDTO {

    readonly nom: string;
    readonly qte?: number;
    readonly unite?: string;
    readonly variable?: boolean;
    readonly lien?: string;

    updatedQty: number;
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

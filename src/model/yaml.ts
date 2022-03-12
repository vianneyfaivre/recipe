/** 
 * Classes that matches with the recipe YAML structure.
 * 
 * Deserialized with jsyaml.
 * 
 * Can't use default values nor methods.
 */
export class PageDataYaml {
		
    readonly title: string;
    readonly preconditions: string[];
    readonly recipes: object; // real type: Map<string, RecipeYaml> (can't be deserialized by jsyaml)
    readonly notes: Array<string | NoteYaml>;
    readonly variations: VariationYaml[];
}

export class RecipeYaml {

    readonly yield?: number;
    readonly yieldType?: string;
    readonly options?: string;
    readonly ingredients: IngredientYaml[];
    readonly preconditions?: string[];
    readonly steps: StepYaml[];
    readonly pictures: number;
}

export class IngredientYaml {

    readonly label: string;
    readonly qty?: number;
    readonly unit?: string;
    readonly variable?: boolean;
    readonly link?: string;
}

export class StepYaml {

    readonly label: string;
    readonly emoji: string;
    readonly details: Array<string | StepDetailYaml>;
}

export class StepDetailYaml {

    readonly label: string;
    readonly link: string;
}

export class NoteYaml {

    readonly label: string;
    readonly link?: string;
}

export class VariationYaml {

    readonly label: string;
    readonly todo: boolean;
}
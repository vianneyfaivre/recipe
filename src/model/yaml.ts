/** 
 * Classes that matches with the recipe YAML structure.
 * 
 * Deserialized with jsyaml.
 * 
 * Can't use default values nor methods.
 */
export class PageDataYaml {
		
    declare readonly title: string;
    declare readonly preconditions: string[];
    declare readonly recipes: object; // real type: Map<string, RecipeYaml> (can't be deserialized by jsyaml)
    declare readonly notes: Array<string | NoteYaml>;
    declare readonly variations: VariationYaml[];
}

export class RecipeYaml {

    declare readonly yield?: number;
    declare readonly yieldType?: string;
    declare readonly options?: string;
    declare readonly ingredients: IngredientYaml[];
    declare readonly preconditions?: string[];
    declare readonly steps: StepYaml[];
    declare readonly notes: Array<string | NoteYaml>;
    declare readonly pictures: number;
}

export class IngredientYaml {

    declare readonly label: string;
    declare readonly qty?: number;
    declare readonly unit?: string;
    declare readonly variable?: boolean;
    declare readonly link?: string;
}

export class StepYaml {

    declare readonly label: string;
    declare readonly emoji: string;
    declare readonly details: Array<string | StepDetailYaml>;
}

export class StepDetailYaml {

    declare readonly label: string;
    declare readonly link: string;
}

export class NoteYaml {

    declare readonly label: string;
    declare readonly link?: string;
}

export class VariationYaml {

    declare readonly label: string;
    declare readonly todo: boolean;
    declare readonly link?: string;
}
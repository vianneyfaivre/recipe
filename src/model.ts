export class PageData {
		
    readonly title: string;
    readonly withYeast: boolean;
    readonly preconditions: string[];
    readonly recettes: Map<string, Recipe>;
    readonly notes: string[] | Note[];
    readonly variantes: Variante[];
}

export class Recipe {

    readonly yield?: number;
    readonly yieldType?: string;
    readonly ingredients: Ingredients[];
    readonly preconditions?: string[];
    readonly etapes: Step[];
}

export class Ingredients {

    readonly nom: string;
    readonly qte?: number;
    readonly unite?: string;
    readonly variable?: boolean;
    readonly lien?: string;
}

export class Step {

    readonly label: string;
    readonly emoji: string = '📜';
    readonly details: string | StepDetail[];
}

export class StepDetail {

    readonly label: string;
    readonly link: string;
}

export class Note {

    readonly label: string;
    readonly link?: string;
}

export class Variante {

    readonly label: string;
    readonly todo: boolean;
}

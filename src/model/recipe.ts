import { pluralizer } from "../util/pluralizer";
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

    _updatedYield?: number;
    public updatedYieldType?: string;

    constructor(
        readonly ingredients: IngredientDTO[],
        readonly steps: StepDTO[],
        readonly options: Option[],
        readonly yieldType?: string,
        readonly preconditions?: string[],
        readonly yyield?: number, // can't use `yield` because it's a reserved keyword
        readonly pictures?: number,
    ) {
        this._updatedYield = yyield;
        this.updatedYieldType = yieldType;
    }

    set updatedYield(yyield: number) {

        if(this.updatedYieldType && isFinite(yyield)) {

            const before = this.updatedYieldType;
            const pluralize = yyield > 1;
            const after = pluralizer.convert(this.updatedYieldType, pluralize);

            if(before !== after) {
                console.debug(`Change unit from '${before}' to '${after}'`);
                this.updatedYieldType = after;
            }
        }

        this._updatedYield = yyield;
    }

    get updatedYield(): number {
        return this._updatedYield;
    }

    hasOption(option: Option): boolean {

        return !!this.options?.find(o => o === option);
    }
}

export enum Option {

    YEAST = "YEAST",
    HYDRATION = "HYDRATION",
}

export class IngredientDTO {

    constructor(
        readonly label: string,
        readonly qty?: number,
        public unit?: string,
        readonly variable?: boolean,
        readonly link?: string,
    ) {
        this._updatedQty = qty;
    }

    _updatedQty?: number;
    nutritionFactsPer100gr?: NutritionFactsDTO;
    nutritionFacts?: NutritionFactsDTO;

    set updatedQty(qty: number) {

        if(this.unit && isFinite(qty)) {

            const before = this.unit;
            const pluralize = qty > 1;
            const after = pluralizer.convert(this.unit, pluralize);

            if(before !== after) {
                console.debug(`Change unit from '${before}' to '${after}'`);
                this.unit = after;
            }
        }

        this._updatedQty = qty;
    }

    get updatedQty(): number {
        return this._updatedQty;
    }
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
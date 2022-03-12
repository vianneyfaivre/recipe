import { PageDataDTO, RecipeDTO, NoteDTO, VariationDTO, IngredientDTO, StepDTO, Option, StepDetailDTO } from "../model/recipe";
import type { IngredientYaml, NoteYaml, PageDataYaml, RecipeYaml, StepYaml, VariationYaml } from "../model/yaml";


const recipesMapper = (recipesObj: any): Map<string, RecipeDTO> => {

    // Convert object to Map
    const recipesYaml: Map<string, RecipeYaml> = new Map(Object.entries(recipesObj));
    const recipesDTO: Map<string, RecipeDTO> = new Map();

    for(const [recipeId, recipeYaml] of [...recipesYaml]) {

        const recipeDTO: RecipeDTO = recipeMapper(recipeYaml);

        recipesDTO.set(recipeId, recipeDTO);
    }

    return recipesDTO;
};

const recipeMapper = (recipe: RecipeYaml): RecipeDTO => {

    const ingredients: IngredientDTO[] = ingredientsMapper(recipe.ingredients);
    const steps: StepDTO[] = stepsMapper(recipe.steps);
    const options: Option[] = optionsMapper(recipe.options);

    return new RecipeDTO(
        ingredients, steps, options, 
        recipe.yieldType, recipe.preconditions, 
        recipe.yield, recipe.pictures); 
};

const stepsMapper = (steps: StepYaml[]): StepDTO[] => {
    
    return steps.map(step => {

        const details = step.details.map(detail => {

            if(typeof detail === "string") {
                return detail;
            } else {
                return new StepDetailDTO(detail.label, detail.link);
            }
        });

        return new StepDTO(step.label, step.emoji, details);
    });
};

const ingredientsMapper = (ingredients: IngredientYaml[]): IngredientDTO[] => {

    return ingredients.map(ingr => new IngredientDTO(ingr.label, ingr.qty, ingr.unit, ingr.variable, ingr.link));
};

const optionsMapper = (options: string): Option[] => {

    let allOptions = (options || "").split(",");

    return allOptions
            .map(option => option.trim())
            .map(option => {
                switch(option) {
                    case Option.HYDRATION: return Option.HYDRATION;
                    case Option.YEAST: return Option.YEAST;
                    default: return null;
                };
            })
            .filter(option => option !== null);
};

const notesMapper = (notes: Array<string | NoteYaml>): Array<string | NoteDTO> => {

    if(!notes) {
        return [];
    }

    return notes.map(note => {

        if(typeof note === "string") {
            return note;
        } else {
            return new NoteDTO(note.label, note.link);
        }
    });
};

const variationsMapper = (variations: VariationYaml[]): VariationDTO[] => {

    if(!variations) {
        return [];
    }

    return variations.map(variation => {
        return new VariationDTO(variation.label, variation.todo);
    });
};

export namespace Mappers {

    export function pageData(source: PageDataYaml): PageDataDTO {

        const recipes: Map<string, RecipeDTO> = recipesMapper(source.recipes);
        const notes: Array<string | NoteDTO> = notesMapper(source.notes);
        const variations: VariationDTO[] = variationsMapper(source.variations);
    
        return new PageDataDTO(
                    source.title,
                    source.preconditions,
                    recipes,
                    notes,
                    variations,
                );
    }
}
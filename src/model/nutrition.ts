/**
 * Nutrition Facts
 */
export class NutritionFactsDTO {

    constructor(
        readonly energy: number, // kCal
        readonly carbs: number,
        readonly fat: number,
        readonly protein: number,
        readonly salt: number,
        readonly viscosity: HydrationDTO
    ) {}
}

export enum HydrationDTO {

    LIQUID,
    SOLID,
    NOT_APPLICABLE
}

/**
 * Nutrition Facts Database - per 100 gr
 * 
 * SOLID vs LIQUID: https://www.youtube.com/watch?v=BUUXwH2L518&t=121s
 * - SOLID = flour
 * - LIQUID = any ingredient that is used to hydrate the flour
 */

const sel = new NutritionFactsDTO(0, 0, 0, 0, 100, HydrationDTO.NOT_APPLICABLE);

// 3068110702235
const farineT45 = new NutritionFactsDTO(345, 72, 1.3, 10, 0, HydrationDTO.SOLID);

// 3564700370315
const lait = new NutritionFactsDTO(64, 4.8, 3.6, 3.2, 0.1, HydrationDTO.LIQUID);

// 20057251
const oeufs = new NutritionFactsDTO(140, 0.27, 9.83, 12.7, 0.31, HydrationDTO.LIQUID);

// 3174660000896
const sucreBlanc = new NutritionFactsDTO(400, 100, 0, 0, 0, HydrationDTO.NOT_APPLICABLE);

// 3412290011074
const beurre = new NutritionFactsDTO(713, 0.6, 80, 0.8, 2, HydrationDTO.NOT_APPLICABLE);

// 3068110361869
const levureSeche = new NutritionFactsDTO(325, 18, 7, 35, 0.51, HydrationDTO.NOT_APPLICABLE);

// 3451790012358
const cremeFleurette = new NutritionFactsDTO(301, 3.1, 31, 2.3, 0.08, HydrationDTO.LIQUID);

// Ingredients without nutritional facts but that we need to compute the hydration ratio
const fleurOranger = new NutritionFactsDTO(0, 0, 0, 0, 0, HydrationDTO.LIQUID);

// Some ingredients has such small quantities that we can ignore them (ex: spices)
const IGNORE: NutritionFactsDTO = new NutritionFactsDTO(0, 0, 0, 0, 0, HydrationDTO.NOT_APPLICABLE);

export const nutritionDB = new Map<string, NutritionFactsDTO>();

// lowercase only!!
nutritionDB.set("farine", farineT45);
nutritionDB.set("farine t45", farineT45);
nutritionDB.set("farine t55", farineT45);
nutritionDB.set("farine blanche", farineT45);
nutritionDB.set("lait", lait);
nutritionDB.set("oeufs", oeufs);
nutritionDB.set("sucre", sucreBlanc);
nutritionDB.set("sucre blanc", sucreBlanc);
nutritionDB.set("beurre", beurre);
nutritionDB.set("sel", sel);
nutritionDB.set("levure sèche", levureSeche);
nutritionDB.set("crème fleurette", cremeFleurette);
nutritionDB.set("eau de fleur d'oranger", fleurOranger);

// ignored ingredients
nutritionDB.set("cardamome", IGNORE);
nutritionDB.set("vanille liquide", IGNORE);
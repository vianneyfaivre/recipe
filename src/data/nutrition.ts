/**
 * Nutrition Facts
 */
export class NutritionFactsDTO {

    constructor(
        readonly energy: number, // kCal
        readonly carbs: number,
        readonly fat: number,
        readonly protein: number,
        readonly salt: number
    ) {}

}

/**
 * Nutrition Facts Database - per 100 gr
 */

const sel = new NutritionFactsDTO(0, 0, 0, 0, 100);

// 3068110702235
const farineT45 = new NutritionFactsDTO(345, 72, 1.3, 10, 0);

// 3564700370315
const lait = new NutritionFactsDTO(64, 4.8, 3.6, 3.2, 0.1);

// 20057251
const oeufs = new NutritionFactsDTO(140, 0.27, 9.83, 12.7, 0.31);

// 3174660000896
const sucreBlanc = new NutritionFactsDTO(400, 100, 0, 0, 0);

// 3412290011074
const beurre = new NutritionFactsDTO(713, 0.6, 80, 0.8, 2);

// 3068110361869
const levureSeche = new NutritionFactsDTO(325, 18, 7, 35, 0.51);

export const nutritionDB = new Map<string, NutritionFactsDTO>();

// lowercase only!!
nutritionDB.set("farine t45", farineT45);
nutritionDB.set("farine blanche", farineT45);
nutritionDB.set("lait", lait);
nutritionDB.set("oeufs", oeufs);
nutritionDB.set("sucre", sucreBlanc);
nutritionDB.set("sucre blanc", sucreBlanc);
nutritionDB.set("beurre", beurre);
nutritionDB.set("sel", sel);
nutritionDB.set("levure sèche", levureSeche);
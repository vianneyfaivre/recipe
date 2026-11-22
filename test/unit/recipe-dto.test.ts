import { describe, it, expect } from 'vitest';
import { IngredientDTO, RecipeDTO, Option } from '../../src/model/recipe';

describe('IngredientDTO.updatedQty setter', () => {
	it('pluralizes the unit when qty > 1', () => {
		const ing = new IngredientDTO('ail', 1, 'gousse');
		ing.updatedQty = 3;
		expect(ing.unit).toBe('gousses');
		expect(ing.updatedQty).toBe(3);
	});

	it('singularizes the unit when qty <= 1', () => {
		const ing = new IngredientDTO('ail', 3, 'gousses');
		ing.updatedQty = 1;
		expect(ing.unit).toBe('gousse');
	});

	it('does not change unit when it is not pluralizable', () => {
		const ing = new IngredientDTO('lait', 100, 'gr');
		ing.updatedQty = 200;
		expect(ing.unit).toBe('gr');
	});

	it('handles ingredient without unit', () => {
		const ing = new IngredientDTO('sel');
		ing.updatedQty = 5;
		expect(ing.unit).toBeUndefined();
		expect(ing.updatedQty).toBe(5);
	});
});

describe('RecipeDTO.updatedYield setter', () => {
	it('pluralizes yieldType when yield > 1', () => {
		const recipe = new RecipeDTO([], [], [], [], 'part', undefined, 1);
		recipe.updatedYield = 4;
		expect(recipe.updatedYieldType).toBe('parts');
		expect(recipe.updatedYield).toBe(4);
	});

	it('singularizes yieldType when yield <= 1', () => {
		const recipe = new RecipeDTO([], [], [], [], 'parts', undefined, 4);
		recipe.updatedYield = 1;
		expect(recipe.updatedYieldType).toBe('part');
	});

	it('leaves non-pluralizable yieldType unchanged', () => {
		const recipe = new RecipeDTO([], [], [], [], 'kg', undefined, 1);
		recipe.updatedYield = 5;
		expect(recipe.updatedYieldType).toBe('kg');
	});
});

describe('RecipeDTO.hasOption', () => {
	it('returns true when option is present', () => {
		const recipe = new RecipeDTO([], [], [], [Option.YEAST]);
		expect(recipe.hasOption(Option.YEAST)).toBe(true);
		expect(recipe.hasOption(Option.HYDRATION)).toBe(false);
	});

	it('returns false when options is empty/undefined', () => {
		const recipe = new RecipeDTO([], [], [], []);
		expect(recipe.hasOption(Option.YEAST)).toBe(false);
	});
});

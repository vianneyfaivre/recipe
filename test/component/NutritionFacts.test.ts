import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import NutritionFacts from '../../src/components/NutritionFacts.svelte';
import { IngredientDTO, RecipeDTO, Option } from '../../src/model/recipe';

// All ingredients must be in nutritionDB (src/model/nutrition.ts) with unit "gr"
// (except "oeufs" which is special-cased).
function makeBreadRecipe(options: Option[] = []): RecipeDTO {
	return new RecipeDTO(
		[
			new IngredientDTO('farine', 500, 'gr'),
			new IngredientDTO('eau', 300, 'gr'),
			new IngredientDTO('sel', 10, 'gr'),
			new IngredientDTO('levure sèche', 5, 'gr')
		],
		[],
		[],
		options,
		'miche',
		undefined,
		1 // yield
	);
}

describe('NutritionFacts', () => {
	it('renders nothing when recipe has no yield', () => {
		const recipe = new RecipeDTO(
			[new IngredientDTO('farine', 500, 'gr')],
			[], [], []
		);
		const { container } = render(NutritionFacts, { recipe });
		expect(container.querySelector('section')).toBeNull();
	});

	it('renders nothing when an ingredient is not in the nutrition DB', () => {
		const recipe = new RecipeDTO(
			[
				new IngredientDTO('farine', 500, 'gr'),
				new IngredientDTO('unknown ingredient', 100, 'gr')
			],
			[], [], [],
			'miche', undefined, 1
		);
		const { container } = render(NutritionFacts, { recipe });
		expect(container.querySelector('section')).toBeNull();
	});

	it('renders nothing when an ingredient has a non-gr unit (except oeufs)', () => {
		const recipe = new RecipeDTO(
			[
				new IngredientDTO('farine', 500, 'gr'),
				new IngredientDTO('lait', 200, 'mL') // mL, not gr
			],
			[], [], [],
			'miche', undefined, 1
		);
		const { container } = render(NutritionFacts, { recipe });
		expect(container.querySelector('section')).toBeNull();
	});

	it('renders nutrition facts per portion when all ingredients are eligible', () => {
		render(NutritionFacts, { recipe: makeBreadRecipe() });

		expect(screen.getByText(/Valeurs Nutritionnelles/)).toBeInTheDocument();
		expect(screen.getByText(/Énergie/)).toBeInTheDocument();
		expect(screen.getByText(/Protéines/)).toBeInTheDocument();
	});

	it('shows hydration ratio when HYDRATION option is set', () => {
		render(NutritionFacts, { recipe: makeBreadRecipe([Option.HYDRATION]) });

		expect(screen.getByText(/Taux d'hydratation/)).toBeInTheDocument();
		// eau 300gr (LIQUID) / farine 500gr (SOLID) = 60%
		expect(screen.getByText(/60%/)).toBeInTheDocument();
	});

	it('does not show hydration ratio without HYDRATION option', () => {
		render(NutritionFacts, { recipe: makeBreadRecipe() });

		expect(screen.queryByText(/Taux d'hydratation/)).not.toBeInTheDocument();
	});

	it('handles eggs specially (qty * 50 grams)', () => {
		const recipe = new RecipeDTO(
			[
				new IngredientDTO('farine', 200, 'gr'),
				new IngredientDTO('oeufs', 2) // 2 eggs = 100gr
			],
			[], [], [],
			'parts', undefined, 4
		);
		render(NutritionFacts, { recipe });
		expect(screen.getByText(/Valeurs Nutritionnelles/)).toBeInTheDocument();
	});
});

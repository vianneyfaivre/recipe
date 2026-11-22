import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { flushSync } from 'svelte';
import Ingredients from '../../src/components/Ingredients.svelte';
import { IngredientDTO, RecipeDTO } from '../../src/model/recipe';

function makeRecipe(): RecipeDTO {
	return new RecipeDTO(
		[
			new IngredientDTO('variable', 200, 'gr', true),
			new IngredientDTO('fixed', 100, 'gr')
		],
		[],
		[],
		[],
		'units',
		undefined,
		4 // yield
	);
}

describe('Ingredients', () => {
	it('renders all ingredients', () => {
		render(Ingredients, { recipe: makeRecipe() });

		expect(screen.getByText(/variable/)).toBeInTheDocument();
		expect(screen.getByText(/fixed/)).toBeInTheDocument();
		expect(screen.getByText(/100/)).toBeInTheDocument();
	});

	it('renders the yield when present', () => {
		render(Ingredients, { recipe: makeRecipe() });

		const yieldEl = document.querySelector('[itemprop="recipeYield"]');
		expect(yieldEl).not.toBeNull();
		expect(yieldEl!.textContent).toContain('4');
		expect(yieldEl!.textContent).toContain('units');
	});

	it('scaling the variable ingredient rescales all ingredients and the yield', async () => {
		const user = userEvent.setup();
		render(Ingredients, { recipe: makeRecipe() });

		const input = screen.getByRole('textbox');
		expect(input).toHaveValue('200');

		// double the variable ingredient: 200 -> 400
		await user.clear(input);
		await user.type(input, '400');
		flushSync();

		// the fixed ingredient should have doubled: 100 -> 200
		expect(screen.getByText(/200.*gr/)).toBeInTheDocument();

		// the yield should have doubled: 4 -> 8
		const yieldEl = document.querySelector('[itemprop="recipeYield"]');
		expect(yieldEl!.textContent).toContain('8');
	});

	it('pluralizes units when scaling above 1', async () => {
		const user = userEvent.setup();
		const recipe = new RecipeDTO(
			[
				new IngredientDTO('var', 1, 'gousse', true),
				new IngredientDTO('other', 2, 'gousses')
			],
			[], [], [], 'parts', undefined, 2
		);
		render(Ingredients, { recipe });

		const input = screen.getByRole('textbox');
		await user.clear(input);
		await user.type(input, '3'); // 1 -> 3, so factor = 3
		flushSync();

		// "other" ingredient: 2 gousses * 3 = 6 gousses (still plural)
		// and "var": 3 gousses (pluralized from gousse)
		const lis = document.querySelectorAll('li[itemprop="recipeIngredient"]');
		expect(lis[0].textContent).toContain('gousses');
	});
});

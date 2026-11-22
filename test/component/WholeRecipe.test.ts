import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { flushSync } from 'svelte';
import WholeRecipe from '../../src/pages/WholeRecipe.svelte';
import {
	PageDataDTO,
	RecipeDTO,
	IngredientDTO,
	StepDTO,
	NoteDTO,
	VariationDTO,
	Option
} from '../../src/model/recipe';

function makePageData(): PageDataDTO {
	const recipes = new Map<string, RecipeDTO>();

	recipes.set('Cinnamon Rolls', new RecipeDTO(
		[
			new IngredientDTO('farine T55', 300, 'gr', true),
			new IngredientDTO('lait', 175, 'gr'),
			new IngredientDTO('beurre', 100, 'gr')
		],
		[new StepDTO('Pétrissage', '🥣', ['mélanger', 'pétrir'])],
		['note R1'],
		[Option.YEAST],
		'parts',
		['pre A'],
		6,
		3 // pictures
	));

	recipes.set('Babka', new RecipeDTO(
		[
			new IngredientDTO('farine T55', 300, 'gr', true),
			new IngredientDTO('chocolat', 65, 'gr')
		],
		[new StepDTO('Cuisson', '🔥', ['cuire 30 min'])],
		[new NoteDTO('linked note', '/recettes/other')],
		[],
		undefined,
		undefined,
		1,
		1
	));

	return new PageDataDTO(
		'Rolls',
		['global pre'],
		recipes,
		['global note', new NoteDTO('ext note', 'https://example.com')],
		[new VariationDTO('var 1', false)]
	);
}

describe('WholeRecipe', () => {
	beforeEach(() => {
		window.history.replaceState(null, '', '/');
	});

	it('renders the page title', () => {
		render(WholeRecipe, { pageData: makePageData(), selectedRecipeId: 'Cinnamon Rolls' });
		expect(screen.getByRole('heading', { level: 1, name: 'Rolls' })).toBeInTheDocument();
	});

	it('renders variation buttons when there are multiple recipes', () => {
		render(WholeRecipe, { pageData: makePageData(), selectedRecipeId: 'Cinnamon Rolls' });

		expect(screen.getByRole('button', { name: 'Cinnamon Rolls' })).toHaveClass('active');
		expect(screen.getByRole('button', { name: 'Babka' })).not.toHaveClass('active');
	});

	it('switching variations shows the other recipe', async () => {
		const user = userEvent.setup();
		render(WholeRecipe, { pageData: makePageData(), selectedRecipeId: 'Cinnamon Rolls' });

		// initially shows Cinnamon Rolls ingredients
		expect(screen.getByText(/beurre/)).toBeInTheDocument();

		await user.click(screen.getByRole('button', { name: 'Babka' }));
		flushSync();

		// now shows Babka ingredients
		expect(screen.getByText(/chocolat/)).toBeInTheDocument();
		expect(screen.queryByText(/lait/)).not.toBeInTheDocument();
		expect(screen.getByRole('button', { name: 'Babka' })).toHaveClass('active');
		expect(window.location.search).toBe('?sr=Babka');
	});

	it('renders steps with details', () => {
		render(WholeRecipe, { pageData: makePageData(), selectedRecipeId: 'Cinnamon Rolls' });

		expect(screen.getByText(/Pétrissage/)).toBeInTheDocument();
		expect(screen.getByText('mélanger')).toBeInTheDocument();
		expect(screen.getByText('pétrir')).toBeInTheDocument();
	});

	it('renders notes (global + recipe-level)', () => {
		render(WholeRecipe, { pageData: makePageData(), selectedRecipeId: 'Cinnamon Rolls' });

		expect(screen.getByText('global note')).toBeInTheDocument();
		expect(screen.getByText('note R1')).toBeInTheDocument();
		expect(screen.getByRole('link', { name: 'ext note' })).toHaveAttribute('href', 'https://example.com');
	});

	it('renders variations section', () => {
		render(WholeRecipe, { pageData: makePageData(), selectedRecipeId: 'Cinnamon Rolls' });
		expect(screen.getByText('var 1')).toBeInTheDocument();
	});

	it('renders photos for the selected recipe', () => {
		render(WholeRecipe, { pageData: makePageData(), selectedRecipeId: 'Cinnamon Rolls' });
		// Cinnamon Rolls has 3 pictures
		expect(screen.getAllByRole('img')).toHaveLength(3);
	});

	it('scaling the variable ingredient updates all quantities', async () => {
		const user = userEvent.setup();
		render(WholeRecipe, { pageData: makePageData(), selectedRecipeId: 'Cinnamon Rolls' });

		const input = screen.getByRole('textbox');
		expect(input).toHaveValue('300');

		// double: 300 -> 600
		await user.clear(input);
		await user.type(input, '600');
		flushSync();

		// lait: 175 * 600/300 = 350, beurre: 100 * 600/300 = 200
		expect(screen.getByText(/350/)).toBeInTheDocument();
		expect(screen.getByText(/200/)).toBeInTheDocument();
		// yield: 6 * 600/300 = 12
		const yieldEl = document.querySelector('[itemprop="recipeYield"]');
		expect(yieldEl?.textContent).toContain('12');
	});
});

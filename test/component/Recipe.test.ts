import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import Recipe from '../../src/components/Recipe.svelte';
import {
	PageDataDTO,
	RecipeDTO,
	IngredientDTO,
	StepDTO,
	NoteDTO,
	VariationDTO
} from '../../src/model/recipe';

function makePageData(overrides: Partial<PageDataDTO> = {}): PageDataDTO {
	return new PageDataDTO(
		'Test Page',
		[],
		new Map(),
		overrides.notes ?? [],
		overrides.variations ?? []
	);
}

function makeRecipe(overrides: Partial<ConstructorParameters<typeof RecipeDTO>[0]> = {}): RecipeDTO {
	return new RecipeDTO(
		overrides.ingredients ?? [new IngredientDTO('farine', 100, 'gr')],
		overrides.steps ?? [new StepDTO('Mix', '🥣', ['do it'])],
		overrides.notes ?? [],
		overrides.options ?? [],
		overrides.yieldType,
		overrides.preconditions,
		overrides.yyield,
		overrides.pictures
	);
}

describe('Recipe', () => {
	it('renders ingredients panel and steps panel', () => {
		render(Recipe, {
			pageData: makePageData(),
			recipeId: 'R1',
			recipe: makeRecipe()
		});

		expect(screen.getByText(/farine/)).toBeInTheDocument();
		expect(screen.getByText(/Mix/)).toBeInTheDocument();
		expect(screen.getByText('do it')).toBeInTheDocument();
	});

	it('shows the bottom panel when there are notes, variations, or pictures', () => {
		const pageData = makePageData({
			notes: ['a note'],
			variations: [new VariationDTO('var', false)]
		});
		render(Recipe, { pageData, recipeId: 'R1', recipe: makeRecipe() });

		expect(screen.getByText('a note')).toBeInTheDocument();
		expect(screen.getByText('var')).toBeInTheDocument();
	});

	it('hides the bottom panel when there are no notes, variations, or pictures', () => {
		const { container } = render(Recipe, {
			pageData: makePageData(),
			recipeId: 'R1',
			recipe: makeRecipe({ pictures: 0 })
		});

		expect(container.querySelector('.bottom-panel')).toBeNull();
	});

	it('shows the bottom panel when only pictures are present', () => {
		const { container } = render(Recipe, {
			pageData: makePageData(),
			recipeId: 'R1',
			recipe: makeRecipe({ pictures: 2 })
		});

		expect(container.querySelector('.bottom-panel')).not.toBeNull();
		expect(screen.getAllByRole('img')).toHaveLength(2);
	});

	it('has the schema.org Recipe itemscope', () => {
		const { container } = render(Recipe, {
			pageData: makePageData(),
			recipeId: 'R1',
			recipe: makeRecipe()
		});

		const el = container.querySelector('[itemscope][itemtype="https://schema.org/Recipe"]');
		expect(el).not.toBeNull();
	});
});

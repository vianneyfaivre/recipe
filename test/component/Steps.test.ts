import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import Steps from '../../src/components/Steps.svelte';
import { PageDataDTO, RecipeDTO, StepDTO, StepDetailDTO, Option } from '../../src/model/recipe';

function makePageData(preconditions?: string[]): PageDataDTO {
	return new PageDataDTO('Test', preconditions ?? [], new Map(), [], []);
}

describe('Steps', () => {
	it('renders recipe steps with their details', () => {
		const recipe = new RecipeDTO(
			[],
			[
				new StepDTO('Mix', '🥣', ['step 1', 'step 2']),
				new StepDTO('Bake', '🔥', ['step 3'])
			],
			[],
			[]
		);
		render(Steps, { pageData: makePageData(), recipe });

		expect(screen.getByText(/Mix/)).toBeInTheDocument();
		expect(screen.getByText(/Bake/)).toBeInTheDocument();
		expect(screen.getByText('step 1')).toBeInTheDocument();
		expect(screen.getByText('step 3')).toBeInTheDocument();
	});

	it('renders step detail links as anchors', () => {
		const recipe = new RecipeDTO(
			[],
			[new StepDTO('Do', '', [new StepDetailDTO('linked step', '/recettes/other?sr=X')])],
			[],
			[]
		);
		render(Steps, { pageData: makePageData(), recipe });

		const link = screen.getByRole('link', { name: 'linked step' });
		expect(link).toHaveAttribute('href', '/recettes/other?sr=X');
	});

	it('renders page-level preconditions', () => {
		render(Steps, { pageData: makePageData(['global pre I', 'global pre II']), recipe: new RecipeDTO([], [], [], []) });

		expect(screen.getByText('global pre I')).toBeInTheDocument();
		expect(screen.getByText('global pre II')).toBeInTheDocument();
	});

	it('renders recipe-level preconditions', () => {
		const recipe = new RecipeDTO([], [], [], [], undefined, ['pre A', 'pre B']);
		render(Steps, { pageData: makePageData(), recipe });

		expect(screen.getByText('pre A')).toBeInTheDocument();
		expect(screen.getByText('pre B')).toBeInTheDocument();
	});

	it('shows yeast activation link when recipe has YEAST option', () => {
		const recipe = new RecipeDTO([], [], [], [Option.YEAST]);
		render(Steps, { pageData: makePageData(), recipe });

		const link = screen.getByRole('link', { name: 'Activer la levure' });
		expect(link).toHaveAttribute('href', '/cuisine/levure');
	});

	it('does not show yeast link when recipe has no YEAST option', () => {
		const recipe = new RecipeDTO([], [], [], []);
		render(Steps, { pageData: makePageData(), recipe });

		expect(screen.queryByRole('link', { name: 'Activer la levure' })).not.toBeInTheDocument();
	});
});

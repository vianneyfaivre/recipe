import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { flushSync } from 'svelte';
import RecipeButtons from '../../src/components/RecipeButtons.svelte';
import { RecipeDTO } from '../../src/model/recipe';

function makeRecipes(...ids: string[]): Map<string, RecipeDTO> {
	const map = new Map<string, RecipeDTO>();
	for (const id of ids) {
		map.set(id, new RecipeDTO([], [], [], []));
	}
	return map;
}

describe('RecipeButtons', () => {
	beforeEach(() => {
		window.history.replaceState(null, '', '/');
	});

	it('renders one button per recipe', () => {
		render(RecipeButtons, {
			recipes: makeRecipes('Cinnamon Rolls', 'Babka', 'Chinois'),
			selectedRecipeId: 'Cinnamon Rolls'
		});

		expect(screen.getAllByRole('button')).toHaveLength(3);
		expect(screen.getByRole('button', { name: 'Babka' })).toBeInTheDocument();
	});

	it('marks the selected recipe button as active', () => {
		render(RecipeButtons, {
			recipes: makeRecipes('A', 'B'),
			selectedRecipeId: 'B'
		});

		expect(screen.getByRole('button', { name: 'B' })).toHaveClass('active');
		expect(screen.getByRole('button', { name: 'A' })).not.toHaveClass('active');
	});

	it('clicking a button updates the URL anchor via anchorManager', async () => {
		const user = userEvent.setup();
		render(RecipeButtons, {
			recipes: makeRecipes('A', 'B'),
			selectedRecipeId: 'A'
		});

		await user.click(screen.getByRole('button', { name: 'B' }));
		flushSync();

		// The component calls anchorManager.set(recipeId) which updates the URL
		expect(window.location.search).toBe('?sr=B');
	});
});

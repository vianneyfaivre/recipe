import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import Yield from '../../src/components/Yield.svelte';
import { RecipeDTO } from '../../src/model/recipe';

describe('Yield', () => {
	it('renders the yield and yieldType from the recipe', () => {
		const recipe = new RecipeDTO([], [], [], [], 'parts', undefined, 4);
		render(Yield, { recipe });

		const yieldEl = document.querySelector('[itemprop="recipeYield"]');
		expect(yieldEl?.textContent).toContain('4');
		expect(yieldEl?.textContent).toContain('parts');
	});

	it('prefers updatedYield/updatedYieldType props over recipe values', () => {
		const recipe = new RecipeDTO([], [], [], [], 'parts', undefined, 4);
		render(Yield, { recipe, updatedYield: 8, updatedYieldType: 'parts' });

		const yieldEl = document.querySelector('[itemprop="recipeYield"]');
		expect(yieldEl?.textContent).toContain('8');
		expect(yieldEl?.textContent).not.toContain('4');
	});
});

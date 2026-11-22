import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { flushSync } from 'svelte';
import Photos from '../../src/components/Photos.svelte';
import { RecipeDTO } from '../../src/model/recipe';

function makeRecipe(pictures: number): RecipeDTO {
	return new RecipeDTO([], [], [], [], undefined, undefined, undefined, pictures);
}

describe('Photos', () => {
	it('renders nothing when pictures is 0', () => {
		const { container } = render(Photos, { recipeId: 'R1', recipe: makeRecipe(0), title: 'Test' });
		expect(container.querySelector('.recipe-pictures')).toBeNull();
	});

	it('renders the correct number of images, all at width 100', () => {
		render(Photos, { recipeId: 'R1', recipe: makeRecipe(3), title: 'Test' });

		const imgs = screen.getAllByRole('img');
		expect(imgs).toHaveLength(3);
		for (const img of imgs) {
			expect(img).toHaveAttribute('width', '100');
			expect(img).toHaveAttribute('src', expect.stringContaining('/assets/images/cooking/recipes/Test/R1-'));
		}
	});

	it('maximizes a photo on click and minimizes others', async () => {
		const user = userEvent.setup();
		render(Photos, { recipeId: 'R1', recipe: makeRecipe(2), title: 'Test' });

		const imgs = screen.getAllByRole('img');
		const buttons = screen.getAllByRole('button');

		await user.click(buttons[0]);
		flushSync();

		expect(imgs[0]).toHaveAttribute('width', '400');
		expect(imgs[1]).toHaveAttribute('width', '100');

		await user.click(buttons[1]);
		flushSync();

		expect(imgs[0]).toHaveAttribute('width', '100');
		expect(imgs[1]).toHaveAttribute('width', '400');
	});

	it('minimizes a photo when clicking an already-maximized one', async () => {
		const user = userEvent.setup();
		render(Photos, { recipeId: 'R1', recipe: makeRecipe(1), title: 'Test' });

		const button = screen.getByRole('button');
		const img = screen.getByRole('img');

		await user.click(button);
		flushSync();
		expect(img).toHaveAttribute('width', '400');

		await user.click(button);
		flushSync();
		expect(img).toHaveAttribute('width', '100');
	});
});

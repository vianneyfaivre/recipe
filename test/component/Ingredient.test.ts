import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { flushSync } from 'svelte';
import Ingredient from '../../src/components/Ingredient.svelte';
import { IngredientDTO } from '../../src/model/recipe';

describe('Ingredient', () => {
	it('renders a fixed-quantity ingredient', () => {
		const ingredient = new IngredientDTO('farine', 300, 'gr');
		render(Ingredient, { ingredient });

		const li = screen.getByText(/farine/);
		expect(li.textContent).toContain('300');
		expect(li.textContent).toContain('gr');
	});

	it('renders an ingredient with no quantity as "à souhait"', () => {
		const ingredient = new IngredientDTO('sel');
		render(Ingredient, { ingredient });

		expect(screen.getByText(/à souhait/)).toBeInTheDocument();
	});

	it('renders a variable ingredient with an input', () => {
		const ingredient = new IngredientDTO('lait', 200, 'mL', true);
		render(Ingredient, { ingredient });

		const input = screen.getByRole('textbox');
		expect(input).toHaveValue('200');
	});

	it('calls onQuantityChange when the variable input changes', async () => {
		const user = userEvent.setup();
		const onQuantityChange = vi.fn();
		const ingredient = new IngredientDTO('lait', 200, 'mL', true);
		render(Ingredient, { ingredient, onQuantityChange });

		const input = screen.getByRole('textbox');
		await user.clear(input);
		await user.type(input, '400');
		flushSync();

		expect(onQuantityChange).toHaveBeenCalled();
		// last call should have originalQty=200, newQty=400
		const lastCall = onQuantityChange.mock.calls.at(-1);
		expect(lastCall?.[0]).toBe(200);
		expect(lastCall?.[1]).toBe(400);
	});

	it('ignores non-positive quantities', async () => {
		const user = userEvent.setup();
		const onQuantityChange = vi.fn();
		const ingredient = new IngredientDTO('lait', 200, 'mL', true);
		render(Ingredient, { ingredient, onQuantityChange });

		const input = screen.getByRole('textbox');
		await user.clear(input);
		await user.type(input, '0');
		flushSync();

		// 0 is invalid, so onQuantityChange should not be called with 0
		const callsWithZero = onQuantityChange.mock.calls.filter(c => c[1] === 0);
		expect(callsWithZero).toHaveLength(0);
	});

	it('renders a linked ingredient as an anchor with qty and unit inside', () => {
		const ingredient = new IngredientDTO('crème pâtissière', 300, 'gr', false, '/recettes/creme-patissiere');
		render(Ingredient, { ingredient });

		const link = screen.getByRole('link');
		expect(link).toHaveAttribute('href', '/recettes/creme-patissiere');
		expect(link.textContent).toContain('crème pâtissière');
		expect(link.textContent).toContain('300');
		expect(link.textContent).toContain('gr');
	});

	it('renders a linked ingredient without qty', () => {
		const ingredient = new IngredientDTO('link only', undefined, undefined, false, '?sr=Other');
		render(Ingredient, { ingredient });

		const link = screen.getByRole('link');
		expect(link).toHaveAttribute('href', '?sr=Other');
		expect(link.textContent).toContain('link only');
	});

	it('shows the updatedQty when provided as prop', () => {
		const ingredient = new IngredientDTO('farine', 300, 'gr');
		render(Ingredient, { ingredient, updatedQty: 600 });

		expect(screen.getByText(/600/)).toBeInTheDocument();
		expect(screen.queryByText(/300/)).not.toBeInTheDocument();
	});
});

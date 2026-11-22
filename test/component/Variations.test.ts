import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import Variations from '../../src/components/Variations.svelte';
import { VariationDTO } from '../../src/model/recipe';

describe('Variations', () => {
	it('renders nothing when variations is empty', () => {
		const { container } = render(Variations, { variations: [] });
		expect(container.querySelector('section')).toBeNull();
	});

	it('renders variation labels with checkboxes', () => {
		render(Variations, {
			variations: [
				new VariationDTO('var done', false),
				new VariationDTO('var todo', true)
			]
		});

		const checkboxes = screen.getAllByRole('checkbox');
		expect(checkboxes).toHaveLength(2);
		expect(checkboxes[0]).toBeChecked();   // todo=false => checked
		expect(checkboxes[1]).not.toBeChecked(); // todo=true => unchecked
		expect(screen.getByText('var done')).toBeInTheDocument();
		expect(screen.getByText('var todo')).toBeInTheDocument();
	});

	it('renders linked variations as anchors', () => {
		render(Variations, {
			variations: [new VariationDTO('linked var', true, '/recettes/glacage?sr=Rocher')]
		});

		const link = screen.getByRole('link', { name: 'linked var' });
		expect(link).toHaveAttribute('href', '/recettes/glacage?sr=Rocher');
	});
});

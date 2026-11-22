import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import Notes from '../../src/components/Notes.svelte';
import { NoteDTO } from '../../src/model/recipe';

describe('Notes', () => {
	it('renders nothing when notes is empty', () => {
		const { container } = render(Notes, { notes: [] });
		expect(container.querySelector('section')).toBeNull();
	});

	it('renders string notes as plain list items', () => {
		render(Notes, { notes: ['just a note', 'another one'] });

		expect(screen.getByText('just a note')).toBeInTheDocument();
		expect(screen.getByText('another one')).toBeInTheDocument();
		expect(screen.queryByRole('link')).not.toBeInTheDocument();
	});

	it('renders NoteDTO with link as an anchor', () => {
		render(Notes, { notes: [new NoteDTO('click me', 'https://example.com')] });

		const link = screen.getByRole('link', { name: 'click me' });
		expect(link).toHaveAttribute('href', 'https://example.com');
	});

	it('renders a mix of string and linked notes', () => {
		render(Notes, { notes: ['plain', new NoteDTO('linked', '/recettes/other')] });

		expect(screen.getByText('plain')).toBeInTheDocument();
		expect(screen.getByRole('link', { name: 'linked' })).toHaveAttribute('href', '/recettes/other');
	});
});

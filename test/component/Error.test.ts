import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import Error from '../../src/pages/Error.svelte';

describe('Error page', () => {
	it('renders the error title and message', () => {
		render(Error, { error: 'HTTP 404 - Not Found - /missing.yaml' });

		expect(screen.getByRole('heading', { name: 'Erreur !' })).toBeInTheDocument();
		expect(screen.getByText('Une erreur est survenue.')).toBeInTheDocument();
		expect(screen.getByText(/HTTP 404/)).toBeInTheDocument();
	});
});

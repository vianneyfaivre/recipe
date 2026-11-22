import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/svelte';
import App from '../../src/App.svelte';

// App.svelte calls loadYaml() which uses fetch() — stub it to serve test yaml.
// DEV is false in tests (mocked in vitest.config.js), so DevBar is not rendered.

const TEST_YAML = `title: App Test
recipes:
  Recipe A:
    yield: 4
    yieldType: parts
    ingredients:
      - label: farine
        qty: 100
        unit: gr
    steps:
      - label: Mix
        details:
          - stir
  Recipe B:
    ingredients:
      - label: eau
        qty: 50
        unit: gr
    steps:
      - label: Boil
        details:
          - heat
`;

function stubFetch() {
	vi.stubGlobal('fetch', async (url: string) => {
		if (String(url).includes('good.yaml')) {
			return { ok: true, status: 200, text: async () => TEST_YAML };
		}
		return { ok: false, status: 404, statusText: 'Not Found', text: async () => '' };
	});
}

describe('App', () => {
	beforeEach(() => {
		window.history.replaceState(null, '', '/');
		stubFetch();
	});

	it('loads yaml and renders the first recipe by default', async () => {
		render(App, { recipeYaml: '/good.yaml' });

		await waitFor(() => {
			expect(screen.getByRole('heading', { level: 1, name: 'App Test' })).toBeInTheDocument();
		});
		// first recipe (Recipe A) is selected by default
		expect(screen.getByText(/farine/)).toBeInTheDocument();
		expect(screen.getByRole('button', { name: 'Recipe A' })).toHaveClass('active');
	});

	it('selects the recipe from ?sr= anchor', async () => {
		window.history.replaceState(null, '', '/?sr=Recipe+B');
		render(App, { recipeYaml: '/good.yaml' });

		await waitFor(() => {
			expect(screen.getByText(/eau/)).toBeInTheDocument();
		});
		expect(screen.getByRole('button', { name: 'Recipe B' })).toHaveClass('active');
	});

	it('falls back to first recipe and removes invalid ?sr= anchor', async () => {
		window.history.replaceState(null, '', '/?sr=Nope');
		render(App, { recipeYaml: '/good.yaml' });

		await waitFor(() => {
			expect(screen.getByRole('button', { name: 'Recipe A' })).toHaveClass('active');
		});
		expect(window.location.search).toBe('');
	});

	it('shows the error page when yaml fails to load', async () => {
		render(App, { recipeYaml: '/missing.yaml' });

		await waitFor(() => {
			expect(screen.getByText('Une erreur est survenue.')).toBeInTheDocument();
		});
		expect(screen.getByText(/HTTP 404/)).toBeInTheDocument();
	});

	it('does not render the dev bar in production mode (DEV=false)', async () => {
		const { container } = render(App, { recipeYaml: '/good.yaml' });

		await waitFor(() => {
			expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
		});
		expect(container.querySelector('.dev-yaml-bar')).toBeNull();
	});
});

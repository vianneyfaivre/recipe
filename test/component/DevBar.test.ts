import { describe, it, expect, beforeEach, vi } from 'vitest';

// Override the virtual:build-info mock for this file: DevBar only renders when DEV=true
vi.mock('virtual:build-info', () => ({
	DEV: true,
	YAML_FILES: ['test-features.yaml', 'test-links.yaml', 'does-not-exsist.yaml']
}));

import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { flushSync } from 'svelte';
import DevBar from '../../src/components/DevBar.svelte';

describe('DevBar', () => {
	beforeEach(() => {
		window.history.replaceState(null, '', '/');
		// DevBar reads data-yaml-path from #recipe-v2 — create it
		if (!document.getElementById('recipe-v2')) {
			const el = document.createElement('main');
			el.id = 'recipe-v2';
			el.setAttribute('data-yaml-path', '/test-features.yaml');
			document.body.appendChild(el);
		}
	});

	it('renders the dev bar with a select listing all yaml files', () => {
		render(DevBar);

		const select = screen.getByRole('combobox');
		expect(select).toBeInTheDocument();
		const options = screen.getAllByRole('option');
		expect(options.map(o => o.textContent)).toEqual([
			'test-features.yaml',
			'test-links.yaml',
			'does-not-exsist.yaml'
		]);
	});

	it('shows the current yaml from data-yaml-path as selected', () => {
		render(DevBar);

		const select = screen.getByRole('combobox') as HTMLSelectElement;
		expect(select.value).toBe('test-features.yaml');
	});

	it('prefers ?yaml= URL param over data-yaml-path', () => {
		window.history.replaceState(null, '', '/?yaml=test-links.yaml');
		render(DevBar);

		const select = screen.getByRole('combobox') as HTMLSelectElement;
		expect(select.value).toBe('test-links.yaml');
	});

	it('changing the select fires onchange without throwing', async () => {
		const user = userEvent.setup();
		window.history.replaceState(null, '', '/?sr=Yeast');
		render(DevBar);

		const select = screen.getByRole('combobox') as HTMLSelectElement;
		// jsdom logs "Not implemented: navigation" for location.href assignment
		// but the onchange handler still runs — just verify no exception escapes
		await user.selectOptions(select, 'test-links.yaml');
		flushSync();

		expect(select.value).toBe('test-links.yaml');
	});
});

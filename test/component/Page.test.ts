import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import Page from '../../src/layout/Page.svelte';
import PageWithChild from './fixtures/PageWithChild.svelte';

describe('Page layout', () => {
	it('renders the title in an h1', () => {
		render(Page, { title: 'My Recipe' });
		expect(screen.getByRole('heading', { level: 1, name: 'My Recipe' })).toBeInTheDocument();
	});

	it('renders children content via a wrapper component', () => {
		render(PageWithChild, { title: 'T' });
		expect(screen.getByText('child content here')).toBeInTheDocument();
	});
});

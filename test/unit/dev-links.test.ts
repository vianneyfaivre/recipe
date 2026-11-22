import { describe, it, expect } from 'vitest';
import { preserveYamlParam } from '../../src/util/dev-links';

describe('preserveYamlParam', () => {
	const page = 'http://localhost:8080/?yaml=test-links.yaml';

	it('adds the current yaml param to same-page ?sr= links', () => {
		expect(preserveYamlParam('?sr=Recette 2', page)).toBe('/?sr=Recette+2&yaml=test-links.yaml');
	});

	it('preserves the anchor fragment', () => {
		expect(preserveYamlParam('?sr=Recette 3#anchor', page)).toBe('/?sr=Recette+3&yaml=test-links.yaml#anchor');
	});

	it('leaves links that already have yaml untouched', () => {
		expect(preserveYamlParam('?yaml=rolls.yaml&sr=Babka', page)).toBe('?yaml=rolls.yaml&sr=Babka');
	});

	it('leaves links untouched when the page has no yaml param', () => {
		expect(preserveYamlParam('?sr=Recette 2', 'http://localhost:8080/')).toBe('?sr=Recette 2');
	});

	it('leaves cross-page blog-style links untouched', () => {
		expect(preserveYamlParam('/recettes/glacage?sr=Rocher', page)).toBe('/recettes/glacage?sr=Rocher');
	});

	it('leaves external links untouched', () => {
		expect(preserveYamlParam('https://vianneyfaivre.com', page)).toBe('https://vianneyfaivre.com');
	});
});

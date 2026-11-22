import { describe, it, expect } from 'vitest';
import { yamlPathFromRecipePath } from '../../src/util/recipe-path';

describe('yamlPathFromRecipePath', () => {
	it('maps blog-style recipe paths to yaml files', () => {
		expect(yamlPathFromRecipePath('/recettes/glacage')).toBe('/glacage.yaml');
		expect(yamlPathFromRecipePath('/recettes/glacage/')).toBe('/glacage.yaml');
		expect(yamlPathFromRecipePath('/recettes/cake-au-chocolat')).toBe('/cake-au-chocolat.yaml');
	});

	it('returns null for non-recipe paths', () => {
		expect(yamlPathFromRecipePath('/')).toBeNull();
		expect(yamlPathFromRecipePath('/recettes')).toBeNull();
		expect(yamlPathFromRecipePath('/build/bundle.js')).toBeNull();
		expect(yamlPathFromRecipePath('/assets/img.jpg')).toBeNull();
	});
});

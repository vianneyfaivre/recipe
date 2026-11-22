import { describe, it, expect } from 'vitest';
import { Mappers } from '../../src/util/model-mapper';
import { Option } from '../../src/model/recipe';
import type { PageDataYaml } from '../../src/model/yaml';

describe('Mappers.pageData', () => {
	it('maps a minimal yaml page to PageDataDTO', () => {
		const yaml: PageDataYaml = {
			title: 'Test',
			preconditions: ['pre A'],
			recipes: {
				'Recipe 1': {
					yield: 4,
					yieldType: 'parts',
					ingredients: [{ label: 'flour', qty: 300, unit: 'gr' }],
					steps: [{ label: 'Mix', emoji: '🥣', details: ['step 1', { label: 'linked', link: '?sr=Other' }] }],
					notes: ['a note', { label: 'linked note', link: 'https://example.com' }],
					options: 'YEAST, HYDRATION',
					pictures: 2
				}
			},
			notes: ['global note'],
			variations: [{ label: 'var 1', todo: false, link: '/recettes/other' }]
		} as any;

		const dto = Mappers.pageData(yaml);

		expect(dto.title).toBe('Test');
		expect(dto.preconditions).toEqual(['pre A']);
		expect(dto.recipes.size).toBe(1);
		expect(dto.notes).toEqual(['global note']);
		expect(dto.variations).toHaveLength(1);
		expect(dto.variations[0].label).toBe('var 1');
		expect(dto.variations[0].link).toBe('/recettes/other');

		const recipe = dto.recipes.get('Recipe 1')!;
		expect(recipe.updatedYield).toBe(4);
		expect(recipe.updatedYieldType).toBe('parts');
		expect(recipe.pictures).toBe(2);
		expect(recipe.hasOption(Option.YEAST)).toBe(true);
		expect(recipe.hasOption(Option.HYDRATION)).toBe(true);

		expect(recipe.ingredients).toHaveLength(1);
		expect(recipe.ingredients[0].label).toBe('flour');
		expect(recipe.ingredients[0].qty).toBe(300);
		expect(recipe.ingredients[0].updatedQty).toBe(300);

		expect(recipe.steps).toHaveLength(1);
		expect(recipe.steps[0].label).toBe('Mix');
		expect(recipe.steps[0].details).toHaveLength(2);
		expect(recipe.steps[0].details[0]).toBe('step 1');
		expect(typeof recipe.steps[0].details[1]).not.toBe('string');

		expect(recipe.notes).toHaveLength(2);
		expect(recipe.notes[0]).toBe('a note');
	});

	it('handles missing optional fields gracefully', () => {
		const yaml = {
			title: 'Minimal',
			preconditions: undefined,
			recipes: {
				'R': {
					ingredients: [{ label: 'thing' }],
					steps: [{ label: 'Do', emoji: '', details: ['just do it'] }],
					notes: undefined
				}
			},
			notes: undefined,
			variations: undefined
		} as any;

		const dto = Mappers.pageData(yaml);
		expect(dto.title).toBe('Minimal');
		expect(dto.notes).toEqual([]);
		expect(dto.variations).toEqual([]);

		const recipe = dto.recipes.get('R')!;
		expect(recipe.ingredients[0].label).toBe('thing');
		expect(recipe.ingredients[0].qty).toBeUndefined();
		expect(recipe.notes).toEqual([]);
		expect(recipe.hasOption(Option.YEAST)).toBe(false);
	});

	it('filters unknown options', () => {
		const yaml = {
			title: 'T',
			preconditions: [],
			recipes: {
				'R': {
					ingredients: [],
					steps: [],
					notes: [],
					options: 'YEAST, BOGUS, HYDRATION'
				}
			},
			notes: [],
			variations: []
		} as any;

		const recipe = Mappers.pageData(yaml).recipes.get('R')!;
		expect(recipe.options).toEqual([Option.YEAST, Option.HYDRATION]);
	});
});

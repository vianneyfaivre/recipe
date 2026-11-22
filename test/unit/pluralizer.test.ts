import { describe, it, expect } from 'vitest';
import { pluralizer } from '../../src/util/pluralizer';

describe('pluralizer.convert', () => {
	it('pluralizes known words', () => {
		expect(pluralizer.convert('cuillère', true)).toBe('cuillères');
		expect(pluralizer.convert('gousse', true)).toBe('gousses');
		expect(pluralizer.convert('pincée', true)).toBe('pincées');
		expect(pluralizer.convert('gâteau', true)).toBe('gâteaux');
		expect(pluralizer.convert('litre', true)).toBe('litres');
	});

	it('singularizes known plural words', () => {
		expect(pluralizer.convert('cuillères', false)).toBe('cuillère');
		expect(pluralizer.convert('gousses', false)).toBe('gousse');
		expect(pluralizer.convert('gâteaux', false)).toBe('gâteau');
	});

	it('leaves unknown words unchanged', () => {
		expect(pluralizer.convert('grammes', true)).toBe('grammes');
		expect(pluralizer.convert('grammes', false)).toBe('grammes');
		expect(pluralizer.convert('ml', true)).toBe('ml');
	});

	it('handles multi-word units (only pluralizable parts change)', () => {
		expect(pluralizer.convert('cuillère à café', true)).toBe('cuillères à café');
		expect(pluralizer.convert('cuillères à café', false)).toBe('cuillère à café');
		expect(pluralizer.convert('jaune d\'oeuf', true)).toBe('jaunes d\'oeuf');
	});

	it('handles empty string input', () => {
		expect(pluralizer.convert('', true)).toBe('');
		expect(pluralizer.convert('', false)).toBe('');
	});
});

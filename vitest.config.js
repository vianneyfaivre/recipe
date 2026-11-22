import { defineConfig } from 'vitest/config';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import path from 'node:path';

/**
 * Vitest config for unit + component tests (see https://svelte.dev/docs/svelte/testing).
 *
 * The smoke/integration test (test/smoke.test.js) still runs via `node --test`
 * against the built bundle — it is intentionally separate and not run by Vitest.
 */
export default defineConfig({
	plugins: [
		svelte(),
		// Mock the rollup virtual module `virtual:build-info` (see rollup.config.js).
		// In tests, DEV=false so dev-only code paths treeshake away, matching production.
		{
			name: 'mock-build-info',
			resolveId(id) {
				if (id === 'virtual:build-info') return id;
				return null;
			},
			load(id) {
				if (id === 'virtual:build-info') {
					return 'export const DEV = false;\nexport const YAML_FILES = [];';
				}
				return null;
			}
		}
	],
	test: {
		// jsdom for component tests (per Svelte docs); unit tests for pure .ts
		// logic run in the same env — harmless since they don't touch the DOM
		// (except anchor-manager which needs window).
		environment: 'jsdom',
		globals: true,
		setupFiles: ['./test/setup.ts'],
		include: ['test/unit/**/*.test.ts', 'test/component/**/*.test.ts'],
		// Tell Vitest to use the `browser` entry points in package.json files
		resolve: {
			conditions: ['browser']
		}
	},
	resolve: {
		conditions: ['svelte', 'browser'],
		alias: {
			// allow importing .ts files with explicit extension (as the smoke test does)
		}
	}
});

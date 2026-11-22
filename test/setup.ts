import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/svelte';
import { afterEach, beforeAll } from 'vitest';

// jsdom does not implement the Web Animations API used by Svelte transitions
// (in:fade etc.), so stub element.animate with a no-op that resolves immediately.
beforeAll(() => {
	if (!HTMLElement.prototype.animate) {
		HTMLElement.prototype.animate = function () {
			return {
				finished: Promise.resolve(),
				cancel() {},
				finish() {},
				onfinish: null
			} as any;
		};
	}
});

// Unmount rendered components after each test so queries don't leak
// between tests within the same file.
afterEach(() => {
	cleanup();
});

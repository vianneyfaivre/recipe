import { describe, it, expect, beforeEach } from 'vitest';
import { anchorManager } from '../../src/util/anchor-manager';

describe('anchorManager', () => {
	beforeEach(() => {
		// reset URL between tests
		window.history.replaceState(null, '', '/');
	});

	it('get() returns null when no sr param', () => {
		expect(anchorManager.get()).toBeNull();
	});

	it('set() adds the sr param to the URL', () => {
		anchorManager.set('Babka');
		expect(window.location.search).toBe('?sr=Babka');
		expect(anchorManager.get()).toBe('Babka');
	});

	it('set() replaces an existing sr param', () => {
		window.history.replaceState(null, '', '/?sr=Old');
		anchorManager.set('New');
		expect(anchorManager.get()).toBe('New');
		expect(window.location.search).toBe('?sr=New');
	});

	it('remove() deletes the sr param', () => {
		window.history.replaceState(null, '', '/?sr=Babka');
		anchorManager.remove();
		expect(anchorManager.get()).toBeNull();
		expect(window.location.search).toBe('');
	});

	it('remove() is a no-op when there is no sr param', () => {
		window.history.replaceState(null, '', '/?other=1');
		anchorManager.remove();
		expect(window.location.search).toBe('?other=1');
	});
});

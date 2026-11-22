/// <reference types="svelte" />

// Virtual module provided by the `buildInfo()` plugin in rollup.config.js
declare module 'virtual:build-info' {
	/** true in watch/dev mode, false in production builds */
	export const DEV: boolean;
	/** recipe yaml files in public/ (dev only; empty in production) */
	export const YAML_FILES: string[];
}

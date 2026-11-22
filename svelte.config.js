/** @type {import('svelte/compiler').Config} */
export default {
	// Svelte 5 supports TypeScript in <script lang="ts"> natively (erasable
	// syntax only), so no preprocessor is needed. Non-erasable syntax such as
	// enums lives in plain .ts files under src/model, which are compiled by
	// @rollup/plugin-typescript instead of the Svelte compiler.
};

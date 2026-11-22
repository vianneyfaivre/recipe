import fs from 'node:fs';
import path from 'node:path';
import svelte from 'rollup-plugin-svelte';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import livereload from 'rollup-plugin-livereload';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';
import css from 'rollup-plugin-css-only';

const production = !process.env.ROLLUP_WATCH;
const publicDir = path.resolve('public');

/**
 * Injects build-time constants into the bundle via a virtual module:
 * - DEV: true in watch mode, false in production builds
 * - YAML_FILES: the recipe yaml files in public/ (dev only, so the dev-only
 *   recipe switcher can list them; empty in production and treeshaken away)
 */
function buildInfo() {
	return {
		name: 'build-info',
		buildStart() {
			if (!production) {
				// rebuild when a recipe yaml is added/removed in dev
				for (const f of fs.readdirSync(publicDir)) {
					if (f.endsWith('.yaml')) this.addWatchFile(path.join(publicDir, f));
				}
			}
		},
		resolveId(id) {
			return id === 'virtual:build-info' ? id : null;
		},
		load(id) {
			if (id !== 'virtual:build-info') return null;
			const yamls = production
				? []
				: [
						...fs.readdirSync(publicDir).filter((f) => f.endsWith('.yaml')),
						// not a real file: lets you preview the error page from the dev dropdown
						'does-not-exsist.yaml'
				  ].sort();
			return `export const DEV = ${!production};\nexport const YAML_FILES = ${JSON.stringify(yamls)};`;
		}
	};
}

// rollup 4 loads this config as an ES module, so `require` is unavailable
const { spawn } = process.getBuiltinModule('child_process');

function serve() {
	let server;

	function toExit() {
		if (server) server.kill(0);
	}

	return {
		writeBundle() {
			if (server) return;
			server = spawn('npm', ['run', 'start', '--', '--dev'], {
				stdio: ['ignore', 'inherit', 'inherit'],
				shell: true
			});

			process.on('SIGTERM', toExit);
			process.on('exit', toExit);
		}
	};
}

export default {
	input: 'src/main.ts',
	output: {
		sourcemap: true,
		format: 'iife',
		name: 'app',
		file: 'public/build/bundle.js'
	},
	plugins: [
		buildInfo(),
		svelte({
			compilerOptions: {
				// enable run-time checks when not in production
				dev: !production
			}
		}),
		// we'll extract any component CSS out into
		// a separate file - better for performance
		css({ output: 'bundle.css' }),

		// If you have external dependencies installed from
		// npm, you'll most likely need these plugins. In
		// some cases you'll need additional configuration -
		// consult the documentation for details:
		// https://github.com/rollup/plugins/tree/master/packages/commonjs
		resolve({
			browser: true,
			dedupe: ['svelte'],
			exportConditions: ['svelte', 'browser']
		}),
		commonjs(),
		// sourceMap comes from tsconfig.json (@tsconfig/svelte sets it to true)
		typescript(),

		// In dev mode, call `npm run start` once
		// the bundle has been generated
		!production && serve(),

		// Watch the `public` directory and refresh the
		// browser on changes when not in production
		!production && livereload('public'),

		// If we're building for production (npm run build
		// instead of npm run dev), minify
		production && terser()
	],
	watch: {
		clearScreen: false
	},
	onwarn(warning, defaultHandler) {
		// Svelte 5 ships its internals as ESM source, which contains circular
		// imports by design — they are legal ESM and handled correctly at
		// runtime, so don't spam the console with them.
		if (warning.code === 'CIRCULAR_DEPENDENCY') return;
		defaultHandler(warning);
	}
};

# AGENTS.md — recipe-v2

Single-page **Svelte 5** app that renders recipes for vianneyfaivre.com.
Plain **rollup** build (no SvelteKit, no Vite), TypeScript, ESM (`"type": "module"`).

> **Always consult https://svelte.dev/docs before writing or changing Svelte code.**
> Follow the patterns and best practices recommended by the framework there (runes, components, lifecycle, a11y). When unsure about the right Svelte 5 approach, check svelte.dev first instead of guessing.

## Run / build / check / test

| command | what |
|---|---|
| `npm run dev` (or `run.sh`) | watch build + sirv on [localhost:8080](http://localhost:8080) + livereload |
| `npm run build` (or `run-prod.sh`) | production bundle → `public/build/` (gitignored) |
| `npm start` | serve `public/` with sirv |
| `deploy.sh` | build + copy `public/build/*` into the blog repo's assets |
| `npm run check` | `svelte-check` — keep at **0 errors, 0 warnings** |
| `npm test` | runs everything: `test:vitest` (unit + component) then `test:smoke` |
| `npm run test:vitest` | Vitest run — unit + component tests (jsdom, no build needed) |
| `npm run test:unit` | Vitest run — only `test/unit/**` (pure logic) |
| `npm run test:component` | Vitest run — only `test/component/**` (.svelte components) |
| `npm run test:watch` | Vitest in watch mode for TDD |
| `npm run test:smoke` | `npm run build` + `node --test test/smoke.test.js` (full-bundle integration, jsdom) |
| `npm audit` | currently **0 vulnerabilities**; re-run after dep changes |

Node: `.nvmrc` = `lts/jod`; `package.json` has `engines.node >=22.13.0` (floor set by jsdom).

## Layout

- `src/main.ts` — entry; `mount(App, { target: #recipe-v2, props: { recipeYaml } })`. Reads `data-yaml-path` from the container; **dev only** also honors `?yaml=<file>`.
- `src/App.svelte` — loads yaml (`util/yaml-loader`), picks recipe from `?sr=` (`util/anchor-manager`), renders `pages/WholeRecipe` or `pages/Error`.
- `src/pages/`, `src/layout/` (`Page.svelte` = title + `{@render children?.()}`), `src/components/` (Recipe, Ingredients, Ingredient, Steps, Yield, Notes, Variations, Photos, NutritionFacts, RecipeButtons, DevBar).
- `src/model/` — DTOs (`recipe.ts`, `yaml.ts`, `nutrition.ts`). **Enums live here in plain `.ts`**, compiled by `@rollup/plugin-typescript` (Svelte 5 only supports erasable TS in `.svelte` files — no preprocessor needed, see `svelte.config.js`).
- `src/util/` — yaml-loader, model-mapper, anchor-manager (`sr` query param), pluralizer.
- `public/` — `index.html`, recipe `*.yaml` files, `assets/`, `main.css`. `public/build/` is generated.
- `test/` — tests (see below).
- `vitest.config.js` — Vitest config: jsdom env, `@sveltejs/vite-plugin-svelte`, mocks `virtual:build-info` (DEV=false), setup file `test/setup.ts` (jest-dom matchers + `animate` stub + cleanup).
- `rollup.config.js` — rollup 4 config; `production = !process.env.ROLLUP_WATCH`.

## Recipe yaml model (what the app does with it)

- Top level: `title`, `preconditions`, `recipes` (map id → recipe), `notes`, `variations`.
- A recipe: `ingredients` (label, optional `qty`/`unit`/`variable`/`link`), `steps`, `notes`, `yield`/`yieldType`, `options` (`YEAST`, `HYDRATION`), `pictures`, `preconditions`.
- **Variations**: `recipes` map keys are switched via buttons; selection is stored in the `?sr=<id>` query param (`anchorManager`). Invalid `sr` → first recipe + param removed.
- **Variable ingredients** (`variable: true`) have an `<input>`; editing it scales all ingredient quantities and the yield (unit/yieldType pluralize via `pluralizer`).
- **Links** render as `<a href>` in ingredients (with qty/unit in the text, scaling with the recipe), step details, notes (page- and recipe-level) and variations (`VariationDTO.link`, rendered when present). Two URI styles: `?sr=<id>` jumps to another recipe on the same page, or blog-style paths like `/recettes/glacage?sr=Rocher` (e.g. the "glaçage rocher" ingredient in `cake-chocolat.yaml`'s Marbré). All link cases are isolated in `public/test-links.yaml`.
  - On localhost (dev only), blog-style paths work too: `npm start` uses `sirv public --single` (index.html fallback for extensionless paths; asset-like paths still 404), and `main.ts` maps `/recettes/<name>` → `/<name>.yaml` via `src/util/recipe-path.ts`. Production is unaffected (DEV-gated).
  - Also dev-only: same-page `?sr=` links would drop the `?yaml=` param on reload, so `main.ts` rewrites same-page link hrefs on click via `src/util/dev-links.ts` (`preserveYamlParam`) to keep the selected yaml. Cross-page (`/recettes/`) and external links are untouched.
- `pictures: N` → loads `/assets/images/cooking/recipes/<title>/<recipeId>-<i>.jpg`; click toggles 100↔400 width.
- `options: HYDRATION` → nutrition panel also shows hydration ratio; nutrition facts come from the built-in `nutritionDB` (per-100gr, `src/model/nutrition.ts`).

## Svelte 5 conventions used here

- Runes mode everywhere: `$props()` + `interface Props`, `$state()`, `$derived`/`$derived.by`, `$bindable()` for `bind:` props.
- DOM events are attributes (`onclick`, `oninput`, `onerror`); component events are **callback props** (e.g. `onQuantityChange`).
- Content projection uses snippets (`children` prop + `{@render children?.()}`).
- Components are instantiated with `mount()`/`unmount()` from `svelte`.
- **Reactivity gotcha**: `$state` only proxies plain objects/arrays, **not class instances** (the DTOs), and self-assignment (`x = x`) is a no-op in runes mode. So `Ingredients.svelte` mirrors updated quantities into `$state` (`updatedQuantities`, `updatedYield`, `updatedYieldType`) and passes them down as props; `Photos.svelte` stores plain `{path, width}` objects.
- a11y: clickable photos are `<button type="button">` wrapping the `<img>`.

## Dev-only recipe switcher (must stay out of production)

- `rollup.config.js` has a `buildInfo()` plugin injecting a virtual module `virtual:build-info` (`DEV`, `YAML_FILES`, declared in `src/global.d.ts`). In dev/watch, `YAML_FILES` = sorted `public/*.yaml` **plus a fake `does-not-exsist.yaml`** (to preview the error page); in production `DEV=false, YAML_FILES=[]` and the code treeshakes away.
- `src/components/DevBar.svelte` renders a fixed top bar with a `<select>`; switching navigates to `?yaml=<file>` (drops `sr`). `src/App.svelte` renders it only `{#if DEV}`.
- Guard test: *"production bundle does not contain the dev-only yaml switcher"*.

## Build notes

- `onwarn` in `rollup.config.js` drops `CIRCULAR_DEPENDENCY` warnings — Svelte 5 ships ESM source with internal cycles; benign.
- Minification: `@rollup/plugin-terser`.
- `process.getBuiltinModule('child_process')` is used in the config (rollup 4 loads the config as ESM; `require` is unavailable).
- `package.json`: caret ranges are intentional — `package-lock.json` is committed and provides the pinning; use `npm ci` for reproducible installs. `overrides.ws ^8` fixes the abandoned `livereload`→`ws@7` chain.

## Tests

Three layers, following https://svelte.dev/docs/svelte/testing:

### `test/unit/` — pure logic (Vitest, no DOM needed except anchor-manager)
- `recipe-path.test.ts`, `dev-links.test.ts`, `pluralizer.test.ts`, `anchor-manager.test.ts`, `model-mapper.test.ts`, `recipe-dto.test.ts`
- Test extracted logic in `src/util/` and `src/model/` in isolation.

### `test/component/` — component tests (Vitest + jsdom + @testing-library/svelte)
- One file per component: `Ingredient`, `Ingredients`, `Photos`, `RecipeButtons`, `Notes`, `Variations`, `Yield`, `Steps`, `Error`, `Page`, `WholeRecipe`
- Uses `render()` + `screen` + `userEvent` from `@testing-library/svelte` / `@testing-library/user-event`, and `flushSync()` from `svelte` after interactions (per Svelte docs) — **no `setTimeout` ticks**.
- `test/setup.ts` registers `@testing-library/jest-dom` matchers, stubs `HTMLElement.prototype.animate` (jsdom lacks WAAPI, used by `in:fade`), and auto-cleans up after each test.
- `test/component/fixtures/` — small wrapper .svelte files for testing slot/children rendering.

### `test/smoke.test.js` — full-bundle integration test (node --test, builds first)

Run via `npm run test:smoke` (builds first). Boots `public/build/bundle.js` in **jsdom** with a `fetch` stub serving `public/` and an `animate` stub (jsdom lacks WAAPI, used by `in:fade`). Covers: every `public/*.yaml` renders (title/ingredients/steps, no errors), variation switching + `?sr=` anchor, quantity scaling, photo maximize, link validity (all link types live in `public/test-links.yaml` — ingredient/step/note/variation links, same-page `?sr=` and blog-style `/recettes/<name>?sr=`, each validated against the target yaml's recipe ids), dev bar absent from prod bundle, error page on missing yaml, deep links. When adding features, add a case here **and** a component-level test in `test/component/`.

/**
 * Smoke tests for the built bundle.
 *
 * Runs `public/build/bundle.js` inside jsdom (no browser needed) against the
 * YAML recipes in `public/` and checks that the app renders and stays
 * interactive (variation switching, quantity scaling, pluralization, photos,
 * links, feature sub-recipes, error page, deep links).
 *
 * Run with: npm test   (builds the bundle first, then runs this file)
 */
import test from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import jsdom from 'jsdom';
import jsyaml from 'js-yaml';
import { yamlPathFromRecipePath } from '../src/util/recipe-path.ts';
import { preserveYamlParam } from '../src/util/dev-links.ts';

const { JSDOM } = jsdom;

const PUBLIC_DIR = path.join(import.meta.dirname, '..', 'public');
const BUNDLE_PATH = path.join(PUBLIC_DIR, 'build', 'bundle.js');
const BUNDLE = fs.readFileSync(BUNDLE_PATH, 'utf8');

const BASE_URL = 'http://localhost:8080/';
const RECIPE_YAMLS = fs.readdirSync(PUBLIC_DIR)
    .filter((f) => f.endsWith('.yaml'))
    .map((f) => `/${f}`);

/** Boots the app in jsdom with the given recipe yaml and URL. */
async function boot({ yaml = '/test-features.yaml', url = BASE_URL } = {}) {
    let html = fs.readFileSync(path.join(PUBLIC_DIR, 'index.html'), 'utf8');
    html = html.replace('data-yaml-path="/test-features.yaml"', `data-yaml-path="${yaml}"`);

    const dom = new JSDOM(html, { url, runScripts: 'outside-only', pretendToBeVisual: true });
    const { window } = dom;

    // Serve static files from public/ (jsdom has no fetch/server)
    window.fetch = async (u) => {
        const file = path.join(PUBLIC_DIR, decodeURIComponent(new URL(u, url).pathname));
        if (!fs.existsSync(file)) {
            return { ok: false, status: 404, statusText: 'Not Found', text: async () => '' };
        }
        return { ok: true, status: 200, statusText: 'OK', text: async () => fs.readFileSync(file, 'utf8') };
    };

    // jsdom does not implement the Web Animations API used by in:fade
    window.HTMLElement.prototype.animate = function () {
        return { finished: Promise.resolve(), cancel() {}, finish() {}, onfinish: null };
    };

    const errors = [];
    window.addEventListener('error', (e) => errors.push(e.message));

    window.eval(BUNDLE);
    await tick(300);

    return { window, document: window.document, errors };
}

const tick = (ms) => new Promise((r) => setTimeout(r, ms));
const text = (el) => (el ? el.textContent.replace(/\s+/g, ' ').trim() : '');
const ingredientTexts = (document) =>
    [...document.querySelectorAll('li[itemprop="recipeIngredient"]')].map(text);

test('renders every recipe yaml without errors', async (t) => {
    for (const yaml of RECIPE_YAMLS) {
        await t.test(yaml, async () => {
            const { document, errors } = await boot({ yaml });

            assert.ok(text(document.querySelector('h1')).length > 0, 'title is rendered');
            assert.ok(ingredientTexts(document).length > 0, 'ingredients are rendered');
            assert.ok(
                document.querySelectorAll('li[itemprop="recipeInstructions"]').length > 0,
                'steps are rendered'
            );
            assert.deepStrictEqual(errors, [], 'no runtime errors');
        });
    }
});

test('switching variations updates the recipe, the active button and the URL anchor', async () => {
    const { window, document, errors } = await boot({ yaml: '/test-features.yaml', url: `${BASE_URL}?sr=Yeast` });

    const buttons = [...document.querySelectorAll('nav button')];
    assert.ok(buttons.length > 1, 'multiple variation buttons rendered');

    const before = ingredientTexts(document);
    // click the Hydration button
    const hydrationBtn = buttons.find(b => text(b) === 'Hydration');
    hydrationBtn.click();
    await tick(200);

    assert.strictEqual(text(document.querySelector('nav button.active')), 'Hydration');
    assert.notDeepStrictEqual(ingredientTexts(document), before, 'ingredients changed');
    assert.strictEqual(window.location.search, '?sr=Hydration', 'anchor updated');
    assert.deepStrictEqual(errors, [], 'no runtime errors');
});

test('editing a variable ingredient quantity scales all ingredients and the yield', async () => {
    const { window, document, errors } = await boot({ yaml: '/test-features.yaml', url: `${BASE_URL}?sr=Pictures` });

    const before = ingredientTexts(document);
    const yieldBefore = text(document.querySelector('[itemprop="recipeYield"]'));

    const input = document.querySelector('li[itemprop="recipeIngredient"] input');
    assert.ok(input, 'a variable ingredient input exists');
    const oldQty = Number(input.value);
    input.value = String(oldQty * 2);
    input.dispatchEvent(new window.Event('input', { bubbles: true }));
    await tick(200);

    const after = ingredientTexts(document);
    assert.notDeepStrictEqual(after, before, 'ingredients rescaled');
    assert.strictEqual(input.value, String(oldQty * 2), 'input shows the doubled quantity');
    assert.ok(after.length > 1 && after[1] !== before[1], 'other ingredients rescaled');
    assert.notStrictEqual(text(document.querySelector('[itemprop="recipeYield"]')), yieldBefore, 'yield rescaled');
    assert.deepStrictEqual(errors, [], 'no runtime errors');
});

test('scaling the Pluralizer sub-recipe singularizes/pluralizes units and yieldType', async () => {
    const { window, document, errors } = await boot({ yaml: '/test-features.yaml', url: `${BASE_URL}?sr=Pluralizer` });

    // initial: variable input=1 (unit "gousse" singular), fixed singular=1 pincée, fixed plural=3 feuilles, yield=4 parts
    const input = document.querySelector('li[itemprop="recipeIngredient"] input');
    assert.strictEqual(input.value, '1', 'variable input starts at 1');
    const before = ingredientTexts(document);
    // variable li: "variable : <input> gousse" — unit is singular
    assert.ok(before[0].includes('gousse') && !before[0].includes('gousses'), `initial: unit "gousse" singular — got: ${before[0]}`);
    assert.ok(before.some(t => t.includes('1 pincée')), `initial: "1 pincée" singular — got: ${before.join(' | ')}`);
    assert.ok(before.some(t => t.includes('3 feuilles')), 'initial: "3 feuilles" plural');
    // NB: the constructor assigns yieldType directly without pluralizing,
    // so initial render shows "4 part" (singular, as written in yaml).
    // Pluralization only kicks in when the updatedYield setter runs (on scaling).
    assert.ok(text(document.querySelector('[itemprop="recipeYield"]')).includes('4 part'), 'initial: "4 part" as written in yaml');

    // scale ×2: variable 1→2
    input.value = '2';
    input.dispatchEvent(new window.Event('input', { bubbles: true }));
    await tick(200);

    const after = ingredientTexts(document);
    // variable li unit should now be pluralized: "gousses"
    assert.ok(after[0].includes('gousses'), `scaled: unit "gousses" pluralized — got: ${after[0]}`);
    assert.ok(after.some(t => t.includes('2 pincées')), `scaled: "2 pincées" pluralized — got: ${after.join(' | ')}`);
    assert.ok(after.some(t => t.includes('6 feuilles')), 'scaled: "6 feuilles" stays plural');
    assert.ok(text(document.querySelector('[itemprop="recipeYield"]')).includes('8 parts'), 'scaled: "8 parts" stays plural');
    assert.deepStrictEqual(errors, [], 'no runtime errors');
});

test('Pictures sub-recipe: image files exist on disk for every picture slot', () => {
    // Photos.svelte builds paths as /assets/images/cooking/recipes/<title>/<recipeId>-<i>.jpg
    // and removes <img> on error — so the files must exist or the section renders empty.
    const yamlData = jsyaml.load(fs.readFileSync(path.join(PUBLIC_DIR, 'test-features.yaml'), 'utf8'));
    const title = yamlData.title;
    const picturesCount = yamlData.recipes['Pictures'].pictures;
    for (let i = 1; i <= picturesCount; i++) {
        const imgPath = path.join(PUBLIC_DIR, 'assets/images/cooking/recipes', title, `Pictures-${i}.jpg`);
        assert.ok(fs.existsSync(imgPath), `picture file exists: ${imgPath}`);
    }
});

test('clicking photos maximizes them and minimizes the others', async () => {
    const { window, document, errors } = await boot({ yaml: '/test-features.yaml', url: `${BASE_URL}?sr=Pictures` });

    const widths = () => [...document.querySelectorAll('.recipe-pictures img')].map((i) => i.getAttribute('width'));
    const imgs = () => [...document.querySelectorAll('.recipe-pictures img')];
    assert.deepStrictEqual(widths(), ['100', '100']);

    imgs()[0].dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
    await tick(200);
    assert.deepStrictEqual(widths(), ['400', '100'], 'first photo maximized');

    imgs()[1].dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
    await tick(200);
    assert.deepStrictEqual(widths(), ['100', '400'], 'second photo maximized, first minimized');

    assert.deepStrictEqual(errors, [], 'no runtime errors');
});

test('every link type in test-links.yaml is rendered and points to a valid target', async () => {
    const yaml = '/test-links.yaml';
    const { document, errors } = await boot({ yaml });

    const recipeIdsOf = (file) =>
        Object.keys(jsyaml.load(fs.readFileSync(path.join(PUBLIC_DIR, file), 'utf8')).recipes);

    // every <a> on the page: ingredient links, step-detail links, note links, variation links
    const anchors = [...document.querySelectorAll('a')].map((a) => ({ text: text(a), href: a.getAttribute('href') }));
    assert.ok(anchors.length > 0, 'page has links');

    // every link type/case from the yaml is present
    const expectedCases = [
        'link without qty',
        'link with qty 1', // ingredient, qty only
        'link with qty and unit 1 liter', // ingredient, qty+unit
        'link with anchor', // ingredient, #anchor
        'link to another page 50 gr', // ingredient, blog-style path
        'step link same page', // step detail, ?sr=
        'step link other page', // step detail, /recettes/
        'recipe note link', // recipe-level note
        'global note external link', // page-level note, https
        'variante avec lien', // variation, /recettes/
        'variante lien externe' // variation, https
    ];
    for (const expected of expectedCases) {
        assert.ok(anchors.some((a) => a.text === expected), `link case rendered: "${expected}"`);
    }

    // every rendered link is valid
    const baseOrigin = new URL(BASE_URL).origin;
    for (const { href } of anchors) {
        const url = new URL(href, BASE_URL);
        const sr = url.searchParams.get('sr');

        if (url.origin !== baseOrigin) {
            // external link (https://...) — nothing local to validate
            continue;
        } else if (url.pathname === '/') {
            // same-page link: ?sr=<id> must be a recipe of the current yaml
            assert.ok(sr && recipeIdsOf(yaml.slice(1)).includes(sr), `"${href}" targets a recipe of ${yaml}`);
        } else if (url.pathname.startsWith('/recettes/')) {
            // blog-style link: /recettes/<name>?sr=<id> must target an existing
            // yaml file and (when sr is present) one of its recipes
            const targetYaml = `${url.pathname.replace(/^\/recettes\//, '').replace(/\/$/, '')}.yaml`;
            assert.ok(fs.existsSync(path.join(PUBLIC_DIR, targetYaml)), `"${href}" targets an existing file ${targetYaml}`);
            if (sr) {
                assert.ok(recipeIdsOf(targetYaml).includes(sr), `"${href}" sr targets a recipe of ${targetYaml}`);
            }
        } else {
            // external/blog links (https://..., /cuisine/...) just need to be absolute
            assert.ok(url.protocol === 'https:' || url.pathname.startsWith('/'), `"${href}" is a valid absolute link`);
        }
    }
    assert.deepStrictEqual(errors, [], 'no runtime errors');
});

test('linked ingredients show their quantity inside the link and scale with the recipe', async () => {
    const { window, document, errors } = await boot({ yaml: '/test-links.yaml' });

    const links = () =>
        [...document.querySelectorAll('li[itemprop="recipeIngredient"] a')].map((a) => ({
            text: text(a),
            href: a.getAttribute('href')
        }));

    // "link with qty" / "link with qty and unit" render label + qty (+ unit) inside the <a>
    const before = links();
    const withQty = before.find((l) => /^link with qty [\d.]/.test(l.text));
    const withQtyUnit = before.find((l) => l.text.startsWith('link with qty and unit'));
    assert.ok(withQty && withQty.text.includes('1'), `qty rendered inside the link: "${withQty?.text}"`);
    assert.ok(withQtyUnit && withQtyUnit.text.includes('liter'), `unit rendered inside the link: "${withQtyUnit?.text}"`);

    // scaling the recipe via the variable input must update the linked quantities too
    const input = document.querySelector('li[itemprop="recipeIngredient"] input');
    input.value = String(Number(input.value) * 2);
    input.dispatchEvent(new window.Event('input', { bubbles: true }));
    await tick(200);

    const after = links();
    const withQtyAfter = after.find((l) => /^link with qty [\d.]/.test(l.text));
    assert.ok(withQtyAfter && withQtyAfter.text.includes('2'), `link qty scaled to 2: "${withQtyAfter?.text}"`);

    // the links use either a same-page ?sr= param or a blog-style /recettes/ path (covered in detail by the link test)
    assert.ok(before.every((l) => l.href.startsWith('?sr=') || l.href.startsWith('/recettes/')), 'links use ?sr= or /recettes/ URIs');
    assert.deepStrictEqual(errors, [], 'no runtime errors');
});

test('blog-style recipe paths map to yaml files (dev ingredient links keep their URI)', () => {
    assert.strictEqual(yamlPathFromRecipePath('/recettes/test-features'), '/test-features.yaml');
    assert.strictEqual(yamlPathFromRecipePath('/recettes/test-features/'), '/test-features.yaml');
    assert.strictEqual(yamlPathFromRecipePath('/recettes/test-links'), '/test-links.yaml');
    // non-recipe paths are left alone
    assert.strictEqual(yamlPathFromRecipePath('/'), null);
    assert.strictEqual(yamlPathFromRecipePath('/recettes'), null);
    assert.strictEqual(yamlPathFromRecipePath('/build/bundle.js'), null);
    assert.strictEqual(yamlPathFromRecipePath('/assets/img.jpg'), null);
});

test('same-page links keep the ?yaml= param in dev (so ?sr= links reload the selected recipe)', () => {
    const page = 'http://localhost:8080/?yaml=test-links.yaml';
    // same-page ?sr= link gains the current yaml param
    assert.strictEqual(
        preserveYamlParam('?sr=Recette 2', page),
        '/?sr=Recette+2&yaml=test-links.yaml'
    );
    // anchor fragment is preserved
    assert.strictEqual(
        preserveYamlParam('?sr=Recette 3#anchor', page),
        '/?sr=Recette+3&yaml=test-links.yaml#anchor'
    );
    // already has yaml -> untouched
    assert.strictEqual(preserveYamlParam('?yaml=test-features.yaml&sr=Yeast', page), '?yaml=test-features.yaml&sr=Yeast');
    // no yaml param on the page -> untouched
    assert.strictEqual(preserveYamlParam('?sr=Recette 2', 'http://localhost:8080/'), '?sr=Recette 2');
    // cross-page blog-style links are left to the /recettes/ path mapping
    assert.strictEqual(
        preserveYamlParam('/recettes/test-features?sr=Yeast', page),
        '/recettes/test-features?sr=Yeast'
    );
    // external links untouched
    assert.strictEqual(
        preserveYamlParam('https://vianneyfaivre.com', page),
        'https://vianneyfaivre.com'
    );
});

test('production bundle does not contain the dev-only yaml switcher', () => {
    // the dev top bar (DevBar.svelte) and dev link rewriting must be treeshaken out of production builds
    assert.ok(!BUNDLE.includes('dev-yaml-bar'), 'dev bar markup is not in the bundle');
    assert.ok(!BUNDLE.includes('YAML_FILES'), 'yaml file list is not in the bundle');
    assert.ok(!BUNDLE.includes('preserveYamlParam'), 'dev link helper is not in the bundle');
});

// --- test-features.yaml sub-recipe tests ---

test('test-features: Yeast sub-recipe shows the yeast activation link', async () => {
    const { document, errors } = await boot({ yaml: '/test-features.yaml', url: `${BASE_URL}?sr=Yeast` });

    const yeastLinks = [...document.querySelectorAll('a')].filter(a => a.textContent.trim() === 'Activer la levure');
    assert.strictEqual(yeastLinks.length, 1, 'yeast activation link rendered');
    assert.strictEqual(yeastLinks[0].getAttribute('href'), '/cuisine/levure');
    assert.deepStrictEqual(errors, [], 'no runtime errors');
});

test('test-features: Hydration sub-recipe shows the hydration ratio in nutrition facts', async () => {
    const { document, errors } = await boot({ yaml: '/test-features.yaml', url: `${BASE_URL}?sr=Hydration` });

    assert.ok(document.body.textContent.includes('Valeurs Nutritionnelles'), 'nutrition facts panel rendered');
    assert.ok(document.body.textContent.includes("Taux d'hydratation"), 'hydration ratio rendered');
    // eau 300gr (LIQUID) / farine 500gr (SOLID) = 60%
    assert.ok(document.body.textContent.includes('60%'), 'hydration ratio is 60%');
    assert.deepStrictEqual(errors, [], 'no runtime errors');
});

test('test-features: Nutrition sub-recipe shows nutrition facts without hydration', async () => {
    const { document, errors } = await boot({ yaml: '/test-features.yaml', url: `${BASE_URL}?sr=Nutrition` });

    assert.ok(document.body.textContent.includes('Valeurs Nutritionnelles'), 'nutrition facts panel rendered');
    assert.ok(!document.body.textContent.includes("Taux d'hydratation"), 'no hydration ratio without HYDRATION option');
    assert.deepStrictEqual(errors, [], 'no runtime errors');
});

test('test-features: UnitNoQty sub-recipe renders "à souhait" with unit', async () => {
    const { document, errors } = await boot({ yaml: '/test-features.yaml', url: `${BASE_URL}?sr=UnitNoQty` });

    const li = document.querySelector('li[itemprop="recipeIngredient"]');
    assert.ok(li.textContent.includes('à souhait'), '"à souhait" rendered for qty-less ingredient');
    assert.ok(li.textContent.includes('cuillère à café'), 'unit rendered');
    assert.deepStrictEqual(errors, [], 'no runtime errors');
});

test('test-features: NoYield sub-recipe has no yield element', async () => {
    const { document, errors } = await boot({ yaml: '/test-features.yaml', url: `${BASE_URL}?sr=NoYield` });

    assert.strictEqual(document.querySelector('[itemprop="recipeYield"]'), null, 'no yield element');
    assert.ok(!document.body.textContent.includes('Valeurs Nutritionnelles'), 'no nutrition panel without yield');
    assert.deepStrictEqual(errors, [], 'no runtime errors');
});

test('test-features: RecipePreconditions sub-recipe shows recipe-level preconditions', async () => {
    const { document, errors } = await boot({ yaml: '/test-features.yaml', url: `${BASE_URL}?sr=RecipePreconditions` });

    assert.ok(document.body.textContent.includes('recipe precondition A'));
    assert.ok(document.body.textContent.includes('recipe precondition B'));
    assert.deepStrictEqual(errors, [], 'no runtime errors');
});

test('test-features: RecipeNotes sub-recipe shows recipe-level notes', async () => {
    const { document, errors } = await boot({ yaml: '/test-features.yaml', url: `${BASE_URL}?sr=RecipeNotes` });

    assert.ok(document.body.textContent.includes('recipe note string'));
    const noteLinks = [...document.querySelectorAll('a')].filter(a => a.textContent.trim() === 'recipe note with link');
    assert.strictEqual(noteLinks.length, 1);
    assert.strictEqual(noteLinks[0].getAttribute('href'), '?sr=Yeast');
    assert.deepStrictEqual(errors, [], 'no runtime errors');
});

test('shows the error page when the recipe yaml cannot be loaded', async () => {
    const { document, errors } = await boot({ yaml: '/does-not-exist.yaml' });

    assert.ok(document.body.textContent.includes('Une erreur est survenue.'));
    assert.ok(document.body.textContent.includes('HTTP 404'));
    assert.deepStrictEqual(errors, [], 'no uncaught errors');
});

test('deep link ?sr= selects the matching variation, invalid anchors fall back to the first recipe', async () => {
    let r = await boot({ yaml: '/test-features.yaml', url: `${BASE_URL}?sr=Hydration` });
    assert.strictEqual(text(r.document.querySelector('nav button.active')), 'Hydration');
    assert.deepStrictEqual(r.errors, []);

    r = await boot({ yaml: '/test-features.yaml', url: `${BASE_URL}?sr=Nope` });
    assert.strictEqual(text(r.document.querySelector('nav button.active')), 'Yeast', 'falls back to first recipe');
    assert.strictEqual(r.window.location.search, '', 'invalid anchor removed from URL');
    assert.deepStrictEqual(r.errors, []);
});

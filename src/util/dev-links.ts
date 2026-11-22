/**
 * Dev only: a same-page link like `?sr=Recette 2` replaces the whole query
 * string, so on a page loaded via `?yaml=test-links.yaml` it would reload the
 * default recipe from index.html. This rewrites such hrefs to keep the current
 * `yaml` param. Cross-page links (/recettes/...) and external links are
 * returned unchanged (the /recettes/ path already selects the yaml via
 * yamlPathFromRecipePath).
 */
export function preserveYamlParam(href: string, currentUrl: string): string {
    const url = new URL(href, currentUrl);
    const current = new URL(currentUrl);

    if (url.origin !== current.origin) return href; // external link
    if (url.pathname !== current.pathname) return href; // cross-page link

    const yaml = current.searchParams.get('yaml');
    if (!yaml || url.searchParams.has('yaml')) return href;

    url.searchParams.set('yaml', yaml);
    return url.pathname + url.search + url.hash;
}

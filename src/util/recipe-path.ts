/**
 * Dev only: maps a blog-style recipe URL path to the yaml file served from
 * public/, e.g. `/recettes/glacage` -> `/glacage.yaml`.
 *
 * This lets ingredient links such as `/recettes/glacage?sr=Rocher` work on
 * localhost (where sirv serves index.html for extensionless paths via
 * `--single`) without changing the URI. On the blog, each /recettes/<name>
 * page has its own data-yaml-path, so this is never used in production.
 */
export function yamlPathFromRecipePath(pathname: string): string | null {
    const match = pathname.match(/^\/recettes\/([^/]+?)\/?$/);
    return match ? `/${match[1]}.yaml` : null;
}

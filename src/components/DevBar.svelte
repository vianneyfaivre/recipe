<script lang="ts">
    import { YAML_FILES } from 'virtual:build-info';

    // Dev-only top bar: lets you switch between the yaml recipes in public/.
    // Only rendered when DEV is true (see rollup.config.js), so it never
    // ends up in production bundles.

    function currentYaml(): string {
        const fromUrl = new URLSearchParams(window.location.search).get('yaml');
        if (fromUrl) return fromUrl;
        return document.getElementById('recipe-v2')?.getAttribute('data-yaml-path')?.replace(/^\//, '') ?? '';
    }

    let selected: string = $state(currentYaml());

    function onChange(e: Event): void {
        const file = (e.target as HTMLSelectElement).value;
        const url = new URL(window.location.href);
        url.searchParams.set('yaml', file);
        // the currently selected variation may not exist in the other file
        url.searchParams.delete('sr');
        window.location.href = url.toString();
    }
</script>

<div class="dev-yaml-bar">
    🛠️ dev only — recette :
    <select value={selected} onchange={onChange}>
        {#each YAML_FILES as file}
            <option value={file}>{file}</option>
        {/each}
    </select>
</div>

<style>
    .dev-yaml-bar {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 9999;
        padding: 6px 10px;
        background: #222;
        color: #eee;
        font: 13px/1.4 sans-serif;
    }
    .dev-yaml-bar select { margin-left: 6px; }
    :global(body) { padding-top: 34px; }
</style>

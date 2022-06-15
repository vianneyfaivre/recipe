<script lang="ts">
    import Page from "../layout/Page.svelte";

    export let error: string;
</script>

<Page title="Erreur !">
    <p>Une erreur est survenue.</p>
    <p>{error}</p>
</Page>
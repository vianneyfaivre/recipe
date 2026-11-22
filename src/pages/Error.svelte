<script lang="ts">
    import Page from "../layout/Page.svelte";

    interface Props {
        error: string;
    }

    let { error }: Props = $props();
</script>

<Page title="Erreur !">
    <p>Une erreur est survenue.</p>
    <p>{error}</p>
</Page>
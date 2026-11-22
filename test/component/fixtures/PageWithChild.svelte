<script lang="ts">
	import Page from '../../../src/layout/Page.svelte';

	interface Props {
		title: string;
	}

	let { title }: Props = $props();
</script>

<Page {title}>
	<p>child content here</p>
</Page>

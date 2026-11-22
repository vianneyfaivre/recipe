<script lang="ts">
    import GlobalStyle from "./GlobalStyle.svelte";

    interface Props {
        title: string;
        children?: import('svelte').Snippet;
    }

    let { title, children }: Props = $props();
</script>

<GlobalStyle /> 
    
<article class="recette">
    
    <h1 itemprop="name">{title}</h1>

    <section>
        {@render children?.()}
    </section>
</article>
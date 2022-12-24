<script lang="ts">
    import GlobalStyle from "./GlobalStyle.svelte";

    export let title: string;
</script>

<GlobalStyle /> 
    
<article class="recette">
    
    <h1 itemprop="name">{title}</h1>

    <section>
        <slot></slot>
    </section>
</article>
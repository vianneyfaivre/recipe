<script lang="ts">
    import GlobalStyle from "./GlobalStyle.svelte";

    export let title: string;
</script>

<GlobalStyle /> 
    
<article class="post h-entry recette">
    
    <header>
        <h1 class="post-title p-name">{title}</h1>
    </header>

    <section>
        <slot></slot>
    </section>
</article>
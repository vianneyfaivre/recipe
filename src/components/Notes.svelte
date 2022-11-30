<script lang="ts">
    import type { NoteDTO } from "../model/recipe";
    
    export let notes: Array<string | NoteDTO>;
</script>

{#if notes && notes.length > 0}
<section>

    <h3>✍️ Notes</h3>
    <ul>
        {#each notes as note }
        
            {#if typeof note === "string" }
                <li>{ note }</li>
            {:else}
                <li><a href="{ note.link }">{ note.label }</a></li>
            {/if}
        {/each}
    </ul>
</section>
{/if}
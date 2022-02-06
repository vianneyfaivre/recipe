<script lang="ts">
    import type { NoteDTO } from "../model/yaml";
    
    export let notes: string[] | NoteDTO[];
</script>

{#if notes }
    <h4>📝 Notes</h4>
    <ul>
    {#each notes as note }

        {#if typeof note === "string" }
            <li>{ note }</li>
        {:else}
            <li><a href="{ note.link }">{ note.label }</a></li>
        {/if}
    {/each}
    </ul>
{/if}
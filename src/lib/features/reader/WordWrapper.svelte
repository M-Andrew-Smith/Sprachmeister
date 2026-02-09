<script lang="ts">
    import ClickableWord from './ClickableWord.svelte';
    
    export let text: string = "";

    $: words = text.split(/\s+/);
</script>

<span>
    {#each words as word}
        <ClickableWord {word} />
        {" "} 
    {/each}
</span>
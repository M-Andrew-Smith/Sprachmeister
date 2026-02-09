<script lang="ts">
    import WordWrapper from '$lib/features/reader/WordWrapper.svelte';
    import type { PageData } from './$types';

    export let data: PageData;
</script>

<main>
    {#if data.article}
        <section class="reader-area">
            {#each data.article.paragraphs as para}
                <div class="paragraph">
                    <WordWrapper text={para} />
                </div>
            {/each}
        </section>
    {:else}
        <p>Artikel wird geladen...</p>
    {/if}
</main>


<script lang="ts">
    import { handleSmartAdd } from '$lib/features/vocabulary/AddWord';

    export let word: string;

    let translatedText = "";
    let isTranslated = false;
    let loading = false;


    $: cleanWord = word.replace(/[.,!?;:()\[\]0-9]/g, "");

    async function toggleTranslation() {
        if (translatedText) {
            isTranslated = !isTranslated;
            return;
        }

        if (!cleanWord.trim()) return;

        loading = true;
        try {
            const response = await fetch('/api/translate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    text: cleanWord, 
                    target: 'EN' 
                })
            });

            if (!response.ok) throw new Error("Translation failed");

            const data = await response.json();
            translatedText = data.translation;

            await handleSmartAdd(cleanWord);

            isTranslated = true;
        } catch (err) {
            console.error("Word Error:", err);
        } finally {
            loading = false;
        }
    }
</script>

<button 
    on:click={toggleTranslation}
    type="button"
    class="word-btn"
    class:is-flipped={isTranslated}
    disabled={loading}
>
    {#if loading}
        <span class="dots">...</span>
    {:else}
        {isTranslated ? translatedText : word}
    {/if}
</button>


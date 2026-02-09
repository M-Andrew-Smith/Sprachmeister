import { vocabStore } from '$lib/stores/TempStorage';
import { get } from 'svelte/store';

export async function getTranslation(word: string) {
    const currentBank = get(vocabStore);
    
    const existing = currentBank.find(w => w.german.toLowerCase() === word.toLowerCase());
    if (existing) return existing.english;

    try {
        const response = await fetch('/api/translate', {
            method: 'POST',
            body: JSON.stringify({ text: word, target: 'EN' })
        });
        const data = await response.json();
        return data.translation;
    } catch (e) {
        console.error("Translation failed", e);
        return "Translation Error";
    }
}
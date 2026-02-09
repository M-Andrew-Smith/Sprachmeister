import { vocabStore } from '$lib/stores/TempStorage';
import { targetLanguage } from '$lib/stores/LangChoice';
import { get } from 'svelte/store';

export async function handleSmartAdd(inputText: string) {
    const word = inputText.trim();
    if (!word) return;

    const goalLang = get(targetLanguage) as string;

    try {
        const response = await fetch('/api/translate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: word, target: goalLang })
        });

        const data = await response.json();
        
        const detected = (data.detectedSourceLanguage || 'EN').toUpperCase();
        const translation = data.translation;

        let finalGerman = '';
        let finalEnglish = '';

        if (detected === goalLang.toUpperCase()) {
            const flipRes = await fetch('/api/translate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: word, target: 'EN' })
            });
            const flipData = await flipRes.json();
            
            finalGerman = word;
            finalEnglish = flipData.translation;
        } else {
            finalGerman = translation;
            finalEnglish = word;
        }

        vocabStore.update(current => {
            if (current.find(w => w.german.toLowerCase() === finalGerman.toLowerCase())) return current;
            
            return [
                ...current, 
                { 
                    id: crypto.randomUUID(), 
                    german: finalGerman, 
                    english: finalEnglish 
                }
            ];
        });

    } catch (error) {
        console.error("Smart translation failed:", error);
    }
}
import { json } from '@sveltejs/kit';
import { DEEPL_API_KEY } from '$env/static/private';

export const POST = async ({ request }) => {
    const { text, target } = await request.json();

    const response = await fetch('https://api-free.deepl.com/v2/translate', {
        method: 'POST',
        headers: {
            'Authorization': `DeepL-Auth-Key ${DEEPL_API_KEY}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            text: text,
            target_lang: target 
        })
    });

    const data = await response.json();
     
    return json({ 
        translation: data.translations[0].text,
        detectedSourceLanguage: data.translations[0].detected_source_language 
    });
};
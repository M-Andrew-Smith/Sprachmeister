import { getWikiContent } from '$lib/features/reader/WikiService';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
    const article = await getWikiContent(params.slug);
    
    return {
        article
    };
};
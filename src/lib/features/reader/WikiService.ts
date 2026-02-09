export async function getWikiContent(slug: string, paragraphCount: number = 5) {
    const url = `https://de.wikipedia.org/api/rest_v1/page/mobile-html/${slug}`;
    
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Article not found");
        
        const html = await response.text();
        
        // Logic: Extract paragraphs directly and strip tags in one go
        const paragraphs = html.match(/<p>(.*?)<\/p>/g)
            ?.map(p => p.replace(/<[^>]*>?/gm, '')) 
            .filter(text => text.length > 50)
            .slice(0, paragraphCount) || [];

        return {
            title: slug.replace(/_/g, ' '),
            paragraphs: paragraphs
        };
    } catch (err) {
        console.error("Wiki Fetch Failed:", err);
        return { 
            title: "Error", 
            paragraphs: ["Could not find article. Check if the slug is correct."] 
        };
    }
}
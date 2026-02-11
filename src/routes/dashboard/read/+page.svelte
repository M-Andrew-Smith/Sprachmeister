<script lang="ts">
    import * as Card from "$lib/components/ui/card";
    import { Button } from "$lib/components/ui/button";
    import { Badge } from "$lib/components/ui/badge";
    import { BookOpen, Filter } from "lucide-svelte";
    import { goto } from '$app/navigation';

    const genres = [
        {
            name: "Märchen",
            color: "bg-amber-100 text-amber-700 border-amber-200",
            articles: [
                { title: "Der Froschkönig", slug: "Der_Froschkönig", level: "A2" },
                { title: "Rotkäppchen", slug: "Rotkäppchen", level: "B1" }
            ]
        },
        {
            name: "Berühmte Persönlichkeiten",
            color: "bg-blue-100 text-blue-700 border-blue-200",
            articles: [
                { title: "Albert Einstein", slug: "Albert_Einstein", level: "B2" },
                { title: "Brüder Grimm", slug: "Brüder_Grimm", level: "B1" }
            ]
        },
        {
            name: "Städte & Kultur",
            color: "bg-emerald-100 text-emerald-700 border-emerald-200",
            articles: [
                { title: "Berlin", slug: "Berlin", level: "A1" },
                { title: "Kaffee", slug: "Kaffee", level: "A2" }
            ]
        }
    ];
</script>

<div class="p-8 max-w-7xl mx-auto space-y-10">
    
    <header class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div class="space-y-1">
            <h1 class="text-4xl font-extrabold tracking-tight">Reading Library</h1>
            <p class="text-muted-foreground">Improve your German through immersive stories and articles.</p>
        </div>
        
        <div class="flex gap-2 w-full md:w-auto">
            <Button variant="outline" class="gap-2">
                <Filter class="h-4 w-4" />
                Genre Filter
            </Button>
        </div>
    </header>

    <div class="space-y-12">
        {#each genres as genre}
            <section class="space-y-6">
                <div class="flex items-center gap-4">
                    <h2 class="text-2xl font-bold tracking-tight">{genre.name}</h2>
                    <div class="h-px flex-1 bg-border"></div>
                    <Badge variant="outline" class={genre.color}>{genre.articles.length} Stories</Badge>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {#each genre.articles as article}
                        <Card.Root 
                            class="group hover:shadow-xl transition-all duration-300 border-slate-200 cursor-pointer overflow-hidden"
                            onclick={() => goto(`/dashboard/read/${article.slug}`)}
                        >
                            <Card.Header class="pb-4">
                                <div class="flex justify-between items-start mb-2">
                                    <Badge variant="secondary" class="font-mono">{article.level}</Badge>
                                    <BookOpen class="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                                </div>
                                <Card.Title class="group-hover:text-blue-600 transition-colors">
                                    {article.title}
                                </Card.Title>
                            </Card.Header>
                            <Card.Footer class="bg-slate-50/50 py-3 border-t">
                                <span class="text-sm font-medium text-blue-600 flex items-center gap-1">
                                    Read now
                                    <span class="group-hover:translate-x-1 transition-transform">→</span>
                                </span>
                            </Card.Footer>
                        </Card.Root>
                    {/each}
                </div>
            </section>
        {/each}
    </div>
</div>

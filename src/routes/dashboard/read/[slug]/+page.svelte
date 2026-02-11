<script lang="ts">
    import WordWrapper from '$lib/features/reader/WordWrapper.svelte';
    import { Button } from "$lib/components/ui/button";
    import { ArrowLeft, Settings2, BookOpenText } from "lucide-svelte";
    import { goto } from '$app/navigation';
  
    let { data } = $props();
  </script>
  
  <div class="min-h-screen bg-slate-50/50 pb-20">
    <header class="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur">
      <div class="container mx-auto flex h-14 items-center justify-between px-4">
        <Button variant="ghost" size="sm" onclick={() => goto('/dashboard/read')} class="gap-2">
          <ArrowLeft class="h-4 w-4" />
          Back to Library
        </Button>
        
        <div class="flex items-center gap-4">
          <Button variant="ghost" size="icon">
            <Settings2 class="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  
    <main class="container mx-auto max-w-3xl mt-12 px-6">
      {#if data.article}
        <article class="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <header class="space-y-4 border-b pb-8">
            <div class="flex items-center gap-2 text-blue-600 font-medium text-sm uppercase tracking-wider">
              <BookOpenText class="h-4 w-4" />
              Reading Session
            </div>
            <h1 class="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
              {data.article.title.replace(/_/g, ' ')}
            </h1>
            <p class="text-lg text-slate-500 italic">
              Tap any word to see the translation.
            </p>
          </header>
  
          <section class="reader-area space-y-8">
            {#each data.article.paragraphs as para}
              <div class="paragraph text-xl md:text-2xl leading-[1.8] text-slate-800 font-serif">
                <WordWrapper text={para} />
              </div>
            {/each}
          </section>
        </article>
      {:else}
        <p>Artikel wird geladen...</p>
      {/if}
    </main>
  </div>
  
  <style>
    /* Tailwind v4 needs this reference to use @apply in Svelte files */
    @reference "../../../layout.css";
  
    :global(.paragraph) {
      letter-spacing: -0.011em;
    }
  
    :global(.reader-area span) {
      @apply transition-colors duration-200 rounded px-0.5 cursor-pointer;
    }
  
    :global(.reader-area span:hover) {
      @apply bg-blue-100 text-blue-700;
    }
  </style>
<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import * as Card from "$lib/components/ui/card";
  import { ArrowRight, BookOpen, GraduationCap, LogIn, PlayCircle } from "lucide-svelte";
  import { goto } from '$app/navigation';
  import { authClient } from "$lib/auth-client";

  // Svelte 5 Rune to track session status
  const session = authClient.useSession();
</script>

<div class="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 relative overflow-hidden">
  
  <div class="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-64 bg-linear-to-b from-blue-100/40 to-transparent -z-10"></div>

  <main class="max-w-2xl w-full text-center space-y-12">
    
    <div class="space-y-6">
      <div class="inline-flex items-center rounded-full border border-blue-200 px-3 py-1 text-xs font-semibold bg-blue-50 text-blue-600 mb-2">
        v1.0 is now live
      </div>
      
      <h1 class="text-7xl font-extrabold tracking-tighter text-slate-900">
        Sprach<span class="text-blue-600">meister</span>
      </h1>
      
      <p class="text-xl text-slate-600 max-w-lg mx-auto leading-relaxed">
        Master German vocabulary with a professional, gamified experience designed for serious learners.
      </p>
    </div>

    <Card.Root class="border-none shadow-2xl bg-white/90 backdrop-blur-md">
      <Card.Header class="space-y-1 pt-8">
        <Card.Title class="text-3xl font-bold tracking-tight">
          {#if $session.data} Welcome back! {:else} Ready to level up? {/if}
        </Card.Title>
        <Card.Description class="text-base text-slate-500">
          {#if $session.data}
            Continue where you left off in your Vocabulary Hub.
          {:else}
            Log in to your account or explore the dashboard as a guest.
          {/if}
        </Card.Description>
      </Card.Header>
      
      <Card.Content class="flex flex-col sm:flex-row justify-center gap-4 pb-10 px-6">
        {#if $session.data}
          <Button 
            variant="default" 
            size="lg" 
            class="px-10 py-7 text-xl rounded-full group transition-all shadow-lg hover:shadow-blue-200" 
            onclick={() => goto('/dashboard')}
          >
            Enter Dashboard
            <ArrowRight class="ml-2 h-6 w-6 group-hover:translate-x-1 transition-transform" />
          </Button>
        {:else}
          <Button 
            variant="outline" 
            size="lg" 
            class="px-10 py-7 text-xl rounded-full border-slate-200 hover:bg-slate-50 transition-all text-slate-700" 
            onclick={() => goto('/login')}
          >
            Login
            <LogIn class="ml-2 h-5 w-5" />
          </Button>

          <Button 
            variant="default" 
            size="lg" 
            class="px-10 py-7 text-xl rounded-full bg-blue-600 group transition-all shadow-lg hover:shadow-blue-200" 
            onclick={() => goto('/dashboard')}
          >
            Try Demo
            <PlayCircle class="ml-2 h-6 w-6 group-hover:scale-110 transition-transform" />
          </Button>
        {/if}
      </Card.Content>
    </Card.Root>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 text-left">
      <div class="flex items-start gap-4 p-5 bg-white/60 rounded-2xl border border-white shadow-sm">
        <div class="bg-emerald-100 p-3 rounded-xl text-emerald-600">
          <BookOpen size={24} />
        </div>
        <div>
          <h3 class="font-bold text-slate-900 text-lg">Smart Hub</h3>
          <p class="text-sm text-slate-500 leading-snug">Organize words into custom groups and track your library.</p>
        </div>
      </div>

      <div class="flex items-start gap-4 p-5 bg-white/60 rounded-2xl border border-white shadow-sm">
        <div class="bg-blue-100 p-3 rounded-xl text-blue-600">
          <GraduationCap size={24} />
        </div>
        <div>
          <h3 class="font-bold text-slate-900 text-lg">Practice Arena</h3>
          <p class="text-sm text-slate-500 leading-snug">Multiple study modes including Flashcards and Quizzes.</p>
        </div>
      </div>
    </div>
  </main>

  <footer class="absolute bottom-8 text-slate-400 text-sm font-medium">
    Built with SvelteKit & shadcn
  </footer>
</div>

<style>
  :global(body) {
    font-family: 'Inter', -apple-system, sans-serif;
  }
</style>
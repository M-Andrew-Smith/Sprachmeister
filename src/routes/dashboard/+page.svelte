<script lang="ts">
  import * as Card from "$lib/components/ui/card";
  import { Button } from "$lib/components/ui/button";
  import { Book, PlayCircle, Settings, TrendingUp, Library, UserPlus } from "lucide-svelte";
  import { goto } from '$app/navigation';
  import { authClient } from "$lib/auth-client";

  // Svelte 5 Rune to check if user is a guest or logged in
  const session = authClient.useSession();
</script>

<div class="p-8 max-w-7xl mx-auto space-y-10">
  
  <header class="flex justify-between items-end">
    <div class="space-y-1">
      <h1 class="text-4xl font-extrabold tracking-tight">Dashboard</h1>
      <p class="text-muted-foreground">
        {#if $session.data}
          Willkommen zurück, {$session.data.user.name}! Ready for your German session?
        {:else}
          Willkommen! Explore Sprachmeister's tools in Demo Mode.
        {/if}
      </p>
    </div>
    <Button variant="outline" size="icon">
      <Settings class="h-5 w-5" />
    </Button>
  </header>

  <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
    
    <Card.Root class="md:col-span-2 overflow-hidden border-none shadow-lg bg-linear-to-br from-blue-600 to-indigo-700 text-white">
      <Card.Header>
        {#if $session.data}
          <Card.Title class="text-2xl">Daily Practice</Card.Title>
          <Card.Description class="text-blue-100">Continue where you left off in your "Common Verbs" group.</Card.Description>
        {:else}
          <Card.Title class="text-2xl">Save Your Progress</Card.Title>
          <Card.Description class="text-blue-100">You are currently in Demo Mode. Register now to save your vocabulary and track progress.</Card.Description>
        {/if}
      </Card.Header>
      <Card.Content>
        {#if $session.data}
          <Button 
            variant="secondary" 
            class="bg-white text-blue-600 hover:bg-blue-50 font-bold px-8 shadow-md"
            onclick={() => goto('/dashboard/vocab/practice')}
          >
            <PlayCircle class="mr-2 h-5 w-5" />
            Start Session
          </Button>
        {:else}
          <Button 
            variant="secondary" 
            class="bg-amber-400 text-amber-950 hover:bg-amber-300 font-bold px-8 shadow-md border-none"
            onclick={() => goto('/signup')}
          >
            <UserPlus class="mr-2 h-5 w-5" />
            Register to Save Data
          </Button>
        {/if}
      </Card.Content>
    </Card.Root>

    <Card.Root class="shadow-md">
      <Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
        <Card.Title class="text-sm font-medium">Weekly Progress</Card.Title>
        <TrendingUp class="h-4 w-4 text-muted-foreground" />
      </Card.Header>
      <Card.Content>
        <div class="text-2xl font-bold">{$session.data ? "+120 words" : "---"}</div>
        <p class="text-xs text-muted-foreground">
          {$session.data ? "15% more than last week" : "Register to track stats"}
        </p>
      </Card.Content>
    </Card.Root>

    <button 
      class="text-left transition-transform active:scale-95" 
      onclick={() => goto('/dashboard/vocab')}
    >
      <Card.Root class="hover:border-blue-400 transition-colors h-full cursor-pointer border-2 border-transparent">
        <Card.Header>
          <Library class="h-8 w-8 text-blue-600 mb-2" />
          <Card.Title>Vocabulary Hub</Card.Title>
          <Card.Description>Manage your word lists and study groups.</Card.Description>
        </Card.Header>
      </Card.Root>
    </button>

    <button 
      class="text-left transition-transform active:scale-95" 
      onclick={() => goto('/dashboard/read')}
    >
      <Card.Root class="hover:border-emerald-400 transition-colors h-full cursor-pointer border-2 border-transparent">
        <Card.Header>
          <Book class="h-8 w-8 text-emerald-600 mb-2" />
          <Card.Title>Reading Library</Card.Title>
          <Card.Description>Read German stories with instant translations.</Card.Description>
        </Card.Header>
      </Card.Root>
    </button>

  </div>
</div>
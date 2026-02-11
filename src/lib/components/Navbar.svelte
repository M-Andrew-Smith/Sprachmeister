<script lang="ts">
    import { Button } from "$lib/components/ui/button";
    import * as Card from "$lib/components/ui/card";
    import { BookOpen, LayoutDashboard, Library, LogOut, GraduationCap } from "lucide-svelte";
    import { goto } from '$app/navigation';
    import { page } from '$app/stores';
  </script>
  
  <nav class="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
    <div class="container mx-auto flex h-16 items-center justify-between px-4">
      
      <div class="flex items-center gap-2 cursor-pointer" on:click={() => goto('/')}>
        <div class="bg-primary p-1.5 rounded-lg">
          <GraduationCap class="h-6 w-6 text-primary-foreground" />
        </div>
        <span class="text-xl font-bold tracking-tighter">Sprach<span class="text-blue-600">meister</span></span>
      </div>
  
      <div class="hidden md:flex items-center gap-1">
        <Button 
          variant={$page.url.pathname === '/dashboard' ? 'secondary' : 'ghost'} 
          class="gap-2"
          onclick={() => goto('/dashboard')}
        >
          <LayoutDashboard class="h-4 w-4" />
          Dashboard
        </Button>
        
        <Button 
          variant={$page.url.pathname.includes('/vocab') ? 'secondary' : 'ghost'} 
          class="gap-2"
          onclick={() => goto('/dashboard/vocab')}
        >
          <Library class="h-4 w-4" />
          Vocab
        </Button>
  
        <Button 
          variant={$page.url.pathname.includes('/read') ? 'secondary' : 'ghost'} 
          class="gap-2"
          onclick={() => goto('/dashboard/read')}
        >
          <BookOpen class="h-4 w-4" />
          Reading
        </Button>
      </div>
  
      <div class="flex items-center gap-4">
        <Button variant="ghost" size="icon" class="text-muted-foreground hover:text-destructive" on:click={() => goto('/')}>
          <LogOut class="h-5 w-5" />
        </Button>
      </div>
    </div>
  </nav>
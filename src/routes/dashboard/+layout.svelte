<script lang="ts">
    import Navbar from '$lib/components/Navbar.svelte';
    let { children } = $props();
  </script>
  
  <div class="min-h-screen bg-background">
    <Navbar />
    <main class="animate-in fade-in duration-500">
      {@render children()}
    </main>
  </div>
<script lang="ts">
    import Navbar from '$lib/components/Navbar.svelte';
    
    // If you are using Svelte 5, uncomment the line below:
    // let { children } = $props();
</script>

<div class="dashboard-shell">
    <Navbar />
    
    <main class="content-area">
        <slot /> 
        </main>
</div>
<script lang="ts">
    import Navbar from '$lib/components/Navbar.svelte';
    
    // For Svelte 5: let { children } = $props();
</script>

<div class="dashboard-shell">
    <Navbar />
    
    <main class="content-area">
        <slot /> </main>
</div>
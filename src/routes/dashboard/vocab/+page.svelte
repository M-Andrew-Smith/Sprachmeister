<script lang="ts">
    import { vocabStore, groupsStore } from '$lib/stores/TempStorage';
    import { targetLanguage } from '$lib/stores/LangChoice';
    import { handleSmartAdd } from '$lib/features/vocabulary/AddWord';
    import { GroupManager } from '$lib/features/vocabulary/GroupManager';
    import { selectedStudyGroupId, activeMode } from '$lib/stores/StudyStore';
    import { goto } from '$app/navigation'; // REQUIRED FOR NAVIGATION
    
    // UI Components
    import * as Card from "$lib/components/ui/card";
    import { Button } from "$lib/components/ui/button";
    import { Input } from "$lib/components/ui/input";
    import { Badge } from "$lib/components/ui/badge";
    import { Search, Plus, Trash2, Play, Layers, SpellCheck, CheckCircle2 } from "lucide-svelte";
    
    let wordInput = $state('');
    let searchQuery = $state('');
    let loading = $state(false);
    let activeGroupId = $state('all'); 
    let newGroupName = $state('');

    // Svelte 5: Use a stable instance of the manager
    const manager = new GroupManager(() => {
        // This callback helps trigger UI updates if GroupManager 
        // uses internal non-runes state, though SvelteSet is preferred.
    });

    // Filtering logic
    let filteredWords = $derived($vocabStore.filter(word => {
        const matchesSearch = word.german.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             word.english.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesGroup = activeGroupId === 'all' || word.groupIds?.includes(activeGroupId);
        return matchesSearch && matchesGroup;
    }));

    // FIXED: Added navigation to the practice page
    async function launch(mode: 'flashcards' | 'quiz' | 'spelling') {
        selectedStudyGroupId.set(activeGroupId);
        activeMode.set(mode);
        await goto('/dashboard/vocab/practice'); 
    }

    async function submit() {
        if (!wordInput.trim()) return;
        loading = true;
        await handleSmartAdd(wordInput);
        wordInput = '';
        loading = false;
    }
</script>

<div class="p-8 max-w-7xl mx-auto space-y-8 bg-background min-h-screen">
    
    <header class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div class="space-y-1">
            <h1 class="text-4xl font-extrabold tracking-tight">Vocabulary Hub <span class="text-blue-600">({$targetLanguage})</span></h1>
            <p class="text-muted-foreground font-medium">Manage your collection and prepare for battle.</p>
        </div>
    </header>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="md:col-span-2 relative">
            <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input class="pl-10 h-12 bg-white" placeholder="Search words..." bind:value={searchQuery} />
        </div>
        <div class="flex gap-2">
            <Input 
                class="h-12 bg-white" 
                placeholder="Add word (DE or EN)..." 
                bind:value={wordInput} 
                onkeydown={(e) => e.key === 'Enter' && submit()}
            />
            <Button class="h-12 px-6" onclick={submit} disabled={loading}>
                {#if loading} <span class="animate-spin mr-2">...</span> {/if}
                <Plus class="h-5 w-5 mr-1" /> Add
            </Button>
        </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        <div class="lg:col-span-8 space-y-6">
            <div class="flex items-center gap-4">
                <h2 class="text-2xl font-bold tracking-tight">
                    {activeGroupId === 'all' ? 'All Words' : 'Group View'}
                </h2>
                <div class="h-px flex-1 bg-border"></div>
                <Badge variant="secondary">{filteredWords.length} Words</Badge>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {#each filteredWords as word (word.id)}
                    <Card.Root 
                        class="relative group cursor-pointer border-2 transition-all hover:border-blue-400 
                        {manager.selectedIds.has(word.id) ? 'border-blue-600 bg-blue-50/50 shadow-md' : 'border-transparent bg-card'}"
                    >
                        <div 
                            role="button"
                            tabindex="0"
                            class="w-full h-full"
                            onclick={() => manager.toggle(word.id)}
                            onkeydown={(e) => e.key === 'Enter' && manager.toggle(word.id)}
                        >
                            <Card.Header class="p-4">
                                <div class="flex justify-between items-start">
                                    <span class="text-xl font-bold tracking-tight">{word.german}</span>
                                    {#if manager.selectedIds.has(word.id)}
                                        <CheckCircle2 class="h-5 w-5 text-blue-600" />
                                    {/if}
                                </div>
                                <Card.Description class="text-base font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                                    {word.english}
                                </Card.Description>
                            </Card.Header>
                        </div>
                    </Card.Root>
                {:else}
                    <div class="col-span-full py-20 text-center border-2 border-dashed rounded-3xl text-muted-foreground">
                        No words found. Time to add some!
                    </div>
                {/each}
            </div>
        </div>

        <aside class="lg:col-span-4 space-y-6">
            
            <Card.Root class="shadow-xl border-none bg-slate-900 text-white overflow-hidden">
                <Card.Header>
                    <Card.Title>Groups & Organization</Card.Title>
                </Card.Header>
                <Card.Content class="space-y-4">
                    
                    {#if manager.count > 0 || newGroupName.length > 0}
                        <div class="bg-white/10 p-4 rounded-xl border border-white/20 space-y-3">
                            <p class="text-sm font-bold text-blue-400">
                                {manager.count} Words Selected
                            </p>
                            <Input 
                                class="bg-white/5 border-white/20 text-white placeholder:text-white/40" 
                                placeholder="Enter group name..." 
                                bind:value={newGroupName} 
                            />
                            <div class="flex gap-2">
                                <Button variant="secondary" class="flex-1 font-bold" onclick={() => {
                                    manager.saveToGroup(newGroupName);
                                    newGroupName = '';
                                }}>
                                    Create Group
                                </Button>
                                <Button variant="destructive" size="icon" onclick={() => manager.clear()}>
                                    <Trash2 class="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    {:else}
                        <p class="text-xs text-white/40 italic text-center py-2">
                            Click on word cards below to select them for a group.
                        </p>
                    {/if}
            
                    <div class="flex flex-wrap gap-2 pt-2 border-t border-white/10">
                        <Button variant={activeGroupId === 'all' ? 'default' : 'outline'} size="sm" onclick={() => activeGroupId = 'all'}>All</Button>
                        {#each $groupsStore as group}
                            <Button 
                                variant={activeGroupId === group.id ? 'default' : 'outline'} 
                                size="sm" 
                                class="text-xs"
                                onclick={() => activeGroupId = group.id}
                            >
                                {group.name}
                            </Button>
                        {/each}
                    </div>
                </Card.Content>
            </Card.Root>

            <Card.Root class="shadow-lg border-2 border-blue-100">
                <Card.Header>
                    <Card.Title class="flex items-center gap-2">
                        <Play class="h-5 w-5 text-blue-600" /> Practice Arena
                    </Card.Title>
                </Card.Header>
                <Card.Content class="grid grid-cols-1 gap-3">
                    <Button variant="outline" class="justify-between h-14" onclick={() => launch('flashcards')}>
                        <span class="flex items-center gap-2"><Layers class="h-4 w-4" /> Flashcards</span>
                        <span class="text-xs text-muted-foreground">→</span>
                    </Button>
                    <Button variant="outline" class="justify-between h-14" onclick={() => launch('quiz')}>
                        <span class="flex items-center gap-2"><CheckCircle2 class="h-4 w-4" /> Quiz</span>
                        <span class="text-xs text-muted-foreground">→</span>
                    </Button>
                    <Button variant="outline" class="justify-between h-14" onclick={() => launch('spelling')}>
                        <span class="flex items-center gap-2"><SpellCheck class="h-4 w-4" /> Spelling</span>
                        <span class="text-xs text-muted-foreground">→</span>
                    </Button>
                </Card.Content>
            </Card.Root>
        </aside>
    </div>
</div>
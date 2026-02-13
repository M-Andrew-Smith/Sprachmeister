<script lang="ts">
    import { vocabStore, groupsStore } from '$lib/stores/TempStorage';
    import { targetLanguage } from '$lib/stores/LangChoice';
    import { handleSmartAdd } from '$lib/features/vocabulary/AddWord';
    import { GroupManager } from '$lib/features/vocabulary/GroupManager';
    import { selectedStudyGroupId, activeMode } from '$lib/stores/StudyStore';
    import { goto } from '$app/navigation';
    
    import * as Card from "$lib/components/ui/card";
    import { Button } from "$lib/components/ui/button";
    import { Input } from "$lib/components/ui/input";
    import { Badge } from "$lib/components/ui/badge";
    import { Search, Plus, Trash2, Play, Layers, SpellCheck, CheckCircle2, FolderPlus, X } from "lucide-svelte";
    
    let wordInput = $state('');
    let searchQuery = $state('');
    let loading = $state(false);
    let activeGroupId = $state('all'); 
    let newGroupName = $state('');
    
    // NEW: Tracking which group is currently showing the "Are you sure?" state
    let groupConfirmingDelete = $state<string | null>(null);

    const manager = new GroupManager();

    let filteredWords = $derived($vocabStore.filter(word => {
        const matchesSearch = word.german.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             word.english.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesGroup = activeGroupId === 'all' || word.groupIds?.includes(activeGroupId);
        return matchesSearch && matchesGroup;
    }));

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

    function addSelectedToActiveGroup() {
        if (activeGroupId === 'all') return;
        const group = $groupsStore.find(g => g.id === activeGroupId);
        if (group) {
            manager.saveToGroup(group.name, group.id);
        }
    }

    // NEW: Handles the two-step delete process
    function requestDelete(id: string, e: MouseEvent) {
        e.stopPropagation();
        groupConfirmingDelete = id;
        // Auto-cancel after 3 seconds if they don't confirm
        setTimeout(() => {
            if (groupConfirmingDelete === id) groupConfirmingDelete = null;
        }, 3000);
    }

    function confirmDelete(id: string, e: MouseEvent) {
        e.stopPropagation();
        manager.deleteGroup(id);
        if (activeGroupId === id) activeGroupId = 'all';
        groupConfirmingDelete = null;
    }
</script>

<div class="p-8 max-w-7xl mx-auto space-y-8 bg-background min-h-screen">
    
    <header class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div class="space-y-1">
            <h1 class="text-4xl font-extrabold tracking-tight text-slate-900">Vocabulary Hub <span class="text-blue-600">({$targetLanguage})</span></h1>
            <p class="text-muted-foreground font-medium">Manage your collection and prepare for battle.</p>
        </div>
    </header>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="md:col-span-2 relative">
            <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input class="pl-10 h-12 bg-white shadow-sm" placeholder="Search words..." bind:value={searchQuery} />
        </div>
        <div class="flex gap-2">
            <Input class="h-12 bg-white shadow-sm" placeholder="Quick add..." bind:value={wordInput} onkeydown={(e) => e.key === 'Enter' && submit()} />
            <Button class="h-12 px-6" onclick={submit} disabled={loading}>
                {#if loading} <span class="animate-spin mr-2">...</span> {/if}
                <Plus class="h-5 w-5" />
            </Button>
        </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div class="lg:col-span-8 space-y-6">
            <div class="flex items-center gap-4">
                <h2 class="text-2xl font-bold tracking-tight">{activeGroupId === 'all' ? 'All Words' : 'Group Content'}</h2>
                <div class="h-px flex-1 bg-border"></div>
                <Badge variant="secondary" class="px-3 py-1">{filteredWords.length} Words</Badge>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {#each filteredWords as word (word.id)}
                    <Card.Root 
                        class="relative group cursor-pointer border-2 transition-all 
                        {manager.selectedIds.has(word.id) ? 'border-blue-600 bg-blue-50/50 shadow-md' : 'border-transparent bg-card shadow-sm hover:border-blue-300'}"
                    >
                        <div role="button" tabindex="0" class="w-full h-full p-4" onclick={() => manager.toggle(word.id)}>
                            <div class="flex justify-between items-start">
                                <span class="text-xl font-bold text-slate-800">{word.german}</span>
                                {#if manager.selectedIds.has(word.id)}
                                    <CheckCircle2 class="h-5 w-5 text-blue-600" />
                                {/if}
                            </div>
                            <p class="text-sm font-medium text-slate-500 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                {word.english}
                            </p>
                        </div>
                    </Card.Root>
                {:else}
                    <div class="col-span-full py-20 text-center border-2 border-dashed rounded-3xl text-muted-foreground bg-slate-50/50">
                        No words found here.
                    </div>
                {/each}
            </div>
        </div>

        <aside class="lg:col-span-4 space-y-6">
            <Card.Root class="shadow-xl border-none bg-slate-900 text-white overflow-hidden">
                <Card.Header><Card.Title class="text-lg">Groups & Organization</Card.Title></Card.Header>
                <Card.Content class="space-y-4">
                    
                    {#if manager.count > 0}
                        <div class="bg-white/10 p-4 rounded-xl border border-white/20 space-y-3 animate-in fade-in slide-in-from-top-2">
                            <p class="text-xs font-bold text-blue-400 uppercase tracking-wider">{manager.count} Selected</p>
                            <div class="flex gap-2">
                                <Input class="bg-white/5 border-white/20 text-white h-9" placeholder="Group name..." bind:value={newGroupName} />
                                <Button variant="secondary" size="sm" onclick={() => { manager.saveToGroup(newGroupName); newGroupName = ''; }} disabled={!newGroupName.trim()}>Create</Button>
                            </div>
                            {#if activeGroupId !== 'all'}
                                <Button variant="outline" class="w-full bg-white/5 border-white/20" onclick={addSelectedToActiveGroup}>
                                    <FolderPlus class="mr-2 h-4 w-4" /> Add to Current
                                </Button>
                            {/if}
                            <Button variant="ghost" class="w-full h-8 text-white/50 hover:text-white" onclick={() => manager.clear()}>Cancel Selection</Button>
                        </div>
                    {:else}
                        <p class="text-xs text-white/40 italic text-center py-2">Select cards to manage groups.</p>
                    {/if}
            
                    <div class="flex flex-wrap gap-2 pt-4 border-t border-white/10">
                        <Button variant={activeGroupId === 'all' ? 'default' : 'outline'} size="sm" class="rounded-full" onclick={() => activeGroupId = 'all'}>All</Button>

                        {#each $groupsStore as group (group.id)}
                            <div class="flex items-center bg-white/5 rounded-full border border-white/10 overflow-hidden transition-all hover:border-white/30">
                                <button 
                                    class="px-3 py-1.5 text-xs font-medium {activeGroupId === group.id ? 'text-blue-400' : 'text-white'}"
                                    onclick={() => activeGroupId = group.id}
                                >
                                    {group.name}
                                </button>
                                
                                {#if groupConfirmingDelete === group.id}
                                    <button 
                                        class="bg-red-500 px-2 py-1.5 text-[10px] font-bold text-white animate-in slide-in-from-right-full"
                                        onclick={(e) => confirmDelete(group.id, e)}
                                    >
                                        SURE?
                                    </button>
                                {:else}
                                    <button 
                                        class="pr-2 pl-1 text-white/20 hover:text-red-400 transition-colors"
                                        onclick={(e) => requestDelete(group.id, e)}
                                    >
                                        <X class="h-3 w-3" />
                                    </button>
                                {/if}
                            </div>
                        {/each}
                    </div>
                </Card.Content>
            </Card.Root>

            <Card.Root class="shadow-lg border-2 border-blue-100">
                <Card.Header><Card.Title class="flex items-center gap-2 text-slate-800"><Play class="h-5 w-5 text-blue-600" /> Practice Arena</Card.Title></Card.Header>
                <Card.Content class="grid grid-cols-1 gap-3">
                    <Button variant="outline" class="justify-between h-14" onclick={() => launch('flashcards')} disabled={filteredWords.length === 0}>
                        <span class="flex items-center gap-2 font-semibold"><Layers class="h-4 w-4 text-blue-500" /> Flashcards</span>
                        <span>→</span>
                    </Button>
                    <Button variant="outline" class="justify-between h-14" onclick={() => launch('quiz')} disabled={filteredWords.length === 0}>
                        <span class="flex items-center gap-2 font-semibold"><CheckCircle2 class="h-4 w-4 text-green-500" /> Quiz</span>
                        <span>→</span>
                    </Button>
                    <Button variant="outline" class="justify-between h-14" onclick={() => launch('spelling')} disabled={filteredWords.length === 0}>
                        <span class="flex items-center gap-2 font-semibold"><SpellCheck class="h-4 w-4 text-orange-500" /> Spelling</span>
                        <span>→</span>
                    </Button>
                </Card.Content>
            </Card.Root>
        </aside>
    </div>
</div>
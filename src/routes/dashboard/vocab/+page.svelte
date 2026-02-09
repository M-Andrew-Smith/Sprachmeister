<script lang="ts">
    import { vocabStore, groupsStore } from '$lib/stores/TempStorage';
    import { targetLanguage } from '$lib/stores/LangChoice';
    import { handleSmartAdd } from '$lib/features/vocabulary/AddWord';
    import { GroupManager } from '$lib/features/vocabulary/GroupManager';
    import { selectedStudyGroupId, activeMode } from '$lib/stores/StudyStore';

    let wordInput = '';
    let searchQuery = '';
    let loading = false;
    let activeGroupId = 'all'; 
    let newGroupName = '';
    let confirmingDeleteId: string | null = null;

    let manager = new GroupManager(() => {
        manager = manager; 
    });

    $: filteredWords = $vocabStore.filter(word => {
        const matchesSearch = word.german.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             word.english.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesGroup = activeGroupId === 'all' || word.groupIds?.includes(activeGroupId);
        return matchesSearch && matchesGroup;
    });

    function launch(mode: 'flashcards' | 'quiz' | 'spelling') {
        selectedStudyGroupId.set(activeGroupId);
        activeMode.set(mode);
    }

    function handleSaveGroup() {
        if (!newGroupName.trim()) return;
        manager.saveToGroup(newGroupName);
        newGroupName = '';
    }

    function initiateDelete(id: string) {
        confirmingDeleteId = id;
        setTimeout(() => { if (confirmingDeleteId === id) confirmingDeleteId = null; }, 3000);
    }

    function finalizeDelete(id: string) {
        manager.deleteGroup(id);
        if (activeGroupId === id) activeGroupId = 'all';
        confirmingDeleteId = null;
    }

    async function submit() {
        if (!wordInput) return;
        loading = true;
        await handleSmartAdd(wordInput);
        wordInput = '';
        loading = false;
    }
</script>

<div class="vocab-dashboard">
    <header>
        <h1>My Vocabulary Hub ({$targetLanguage})</h1>
        <p>Manage your collected words and prepare for practice sessions.</p>
    </header>

    <div class="action-section">
        <div class="search-box">
            <input type="text" bind:value={searchQuery} placeholder="Search your words..." />
        </div>
        <div class="add-manual-box">
            <div class="input-group">
                <input type="text" bind:value={wordInput} placeholder="Type in English or DE..." />
                <button on:click={submit} disabled={loading} class="add-btn">+ Add</button>
            </div>
        </div>
    </div>

    <hr />

    <div class="main-layout">
        <section class="word-list-section">
            <h2>{activeGroupId === 'all' ? 'All Words' : 'Current View'}</h2>
            <div class="word-grid">
                {#each filteredWords as word (word.id)}
                    <button 
                        class="word-card" 
                        class:is-selected={manager.selectedIds.has(word.id)}
                        on:click={() => manager.toggle(word.id)}
                    >
                        <span class="de">{word.german}</span>
                        <span class="hover-en">{word.english}</span>
                    </button>
                {:else}
                    <p class="empty">No words found. Add some above!</p>
                {/each}
            </div>
        </section>

        <div class="study-management">
            <section class="groups-container">
                <h2>Word Groups</h2>
                
                {#if manager.count > 0}
                    <div class="inline-selection-tools">
                        <div class="selection-count"><strong>{manager.count}</strong> selected</div>
                        <div class="group-input-wrapper">
                            <input 
                                type="text" 
                                bind:value={newGroupName} 
                                placeholder="Group name..." 
                                on:keydown={(e) => e.key === 'Enter' && handleSaveGroup()}
                            />
                            <button class="save-grp-btn" on:click={handleSaveGroup} disabled={!newGroupName}>
                                Save to Group
                            </button>
                        </div>
                        <div class="action-row">
                            <button class="text-del-btn" on:click={() => manager.deleteSelected()}>Delete</button>
                            <button class="text-clear-btn" on:click={() => manager.clear()}>Cancel</button>
                        </div>
                    </div>
                {/if}

                <div class="group-list">
                    <button 
                        class="group-chip" 
                        class:active={activeGroupId === 'all'}
                        on:click={() => activeGroupId = 'all'}
                    >
                        All Words
                    </button>

                    {#each $groupsStore as group}
                        <div class="group-chip-wrapper">
                            <button 
                                class="group-chip" 
                                class:active={activeGroupId === group.id}
                                on:click={() => activeGroupId = group.id}
                            >
                                {group.name}
                            </button>
                            
                            {#if confirmingDeleteId === group.id}
                                <button class="delete-group-btn confirm" on:click|stopPropagation={() => finalizeDelete(group.id)}>
                                    OK?
                                </button>
                            {:else}
                                <button class="delete-group-btn" on:click|stopPropagation={() => initiateDelete(group.id)}>
                                    ×
                                </button>
                            {/if}
                        </div>
                    {/each}
                </div>
            </section>

            <section class="practice-arena-sidebar">
                <h2>Practice Arena</h2>
                <p class="small-note">Words in session: {filteredWords.length}</p>
                
                <div class="modes-grid">
                    <section class="mode-card">
                        <h3>Flashcards</h3>
                        <a href="/dashboard/vocab/practice" on:click={() => launch('flashcards')}>
                            <button class="launch-btn" disabled={filteredWords.length === 0}>Launch</button>
                        </a>
                    </section>

                    <section class="mode-card">
                        <h3>Quizzes</h3>
                        <a href="/dashboard/vocab/practice" on:click={() => launch('quiz')}>
                            <button class="launch-btn" disabled={filteredWords.length === 0}>Launch</button>
                        </a>
                    </section>

                    <section class="mode-card">
                        <h3>Spelling</h3>
                        <a href="/dashboard/vocab/practice" on:click={() => launch('spelling')}>
                            <button class="launch-btn" disabled={filteredWords.length === 0}>Launch</button>
                        </a>
                    </section>
                </div>
            </section>
        </div>
    </div>
</div>

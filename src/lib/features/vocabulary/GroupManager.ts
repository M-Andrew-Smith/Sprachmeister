import { vocabStore, groupsStore } from '$lib/stores/TempStorage';
import { SvelteSet } from 'svelte/reactivity'; // Import Svelte's reactive Set

export class GroupManager {
    public selectedIds = new SvelteSet<string>();
    
    constructor() {
    }

    toggle(id: string) {
        console.log("Toggling ID:", id); 
        if (this.selectedIds.has(id)) {
            this.selectedIds.delete(id);
        } else {
            this.selectedIds.add(id);
        }
        console.log("Current count:", this.selectedIds.size);
    }

    deleteSelected() {
        vocabStore.update(words => 
            words.filter(w => !this.selectedIds.has(w.id))
        );
        this.clear();
    }

// Add/Update this method in GroupManager.ts
saveToGroup(groupName: string, existingId?: string) {
    const groupId = existingId || crypto.randomUUID();
    
    // Only create a new group entry if we aren't adding to an existing one
    if (!existingId && groupName.trim()) {
        groupsStore.update(gs => [...gs, { id: groupId, name: groupName }]);
    }

    vocabStore.update(words => words.map(word => {
        if (this.selectedIds.has(word.id)) {
            const groups = new Set(word.groupIds || []);
            groups.add(groupId);
            return { ...word, groupIds: Array.from(groups) };
        }
        return word;
    }));

    this.clear();
}

    deleteGroup(groupId: string) {
        console.log("Deleting Group:", groupId);
        groupsStore.update(gs => gs.filter(g => g.id !== groupId));
        vocabStore.update(words => words.map(word => ({
            ...word,
            groupIds: word.groupIds?.filter(id => id !== groupId)
        })));
    }

    clear() {
        this.selectedIds.clear();
    }
    
    get count() { return this.selectedIds.size; }
}
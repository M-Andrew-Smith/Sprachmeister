import { vocabStore, groupsStore } from '$lib/stores/TempStorage';

export class GroupManager {
    public selectedIds: Set<string> = new Set();
    
    constructor(private updateUI: () => void) {}

    toggle(id: string) {
        if (this.selectedIds.has(id)) this.selectedIds.delete(id);
        else this.selectedIds.add(id);
        this.updateUI();
    }

    deleteSelected() {
        vocabStore.update(words => 
            words.filter(w => !this.selectedIds.has(w.id))
        );
        this.clear();
    }

    saveToGroup(groupName: string) {
        const newGroupId = crypto.randomUUID();
        
        groupsStore.update(gs => [...gs, { id: newGroupId, name: groupName }]);

        vocabStore.update(words => words.map(word => {
            if (this.selectedIds.has(word.id)) {
                const existingGroups = word.groupIds || [];
                return { ...word, groupIds: [...existingGroups, newGroupId] };
            }
            return word;
        }));

        this.clear();
    }

    deleteGroup(groupId: string) {
        groupsStore.update(gs => gs.filter(g => g.id !== groupId));
        vocabStore.update(words => words.map(word => ({
            ...word,
            groupIds: word.groupIds?.filter(id => id !== groupId)
        })));
        this.updateUI();
    }

    clear() {
        this.selectedIds.clear();
        this.updateUI();
    }
    
    get count() { return this.selectedIds.size; }
}
import { writable } from 'svelte/store';

export interface VocabItem {
    id: string;
    word: string;
    translation: string;
    groupId?: string; 
}

export interface VocabGroup {
    id: string;
    name: string;
}

export const vocabStore = writable<VocabItem[]>([]);
export const groupStore = writable<VocabGroup[]>([
    { id: '1', name: 'General' },
    { id: '2', name: 'Science' }
]);
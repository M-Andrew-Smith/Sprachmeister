import { writable } from 'svelte/store';

export interface Word {
    id: string;
    german: string;
    english: string;
    groupIds?: string[]; 
}

export interface Group {
    id: string;
    name: string;
}

export const vocabStore = writable<Word[]>([]);
export const groupsStore = writable<Group[]>([]); 
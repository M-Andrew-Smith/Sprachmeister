import { writable } from 'svelte/store';

// Make sure 'export' is written and 'targetLanguage' matches AddWord.ts
export const targetLanguage = writable('DE');
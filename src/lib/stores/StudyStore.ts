import { writable, derived } from 'svelte/store';
import { vocabStore } from './TempStorage';

export type PracticeMode = 'flashcards' | 'quiz' | 'spelling' | null;

export const activeMode = writable<PracticeMode>(null);
export const selectedStudyGroupId = writable<string>('all');

export const studyWords = derived(
    [vocabStore, selectedStudyGroupId],
    ([$words, $groupId]) => {
        if ($groupId === 'all') return $words;
        return $words.filter(w => w.groupIds?.includes($groupId));
    }
);
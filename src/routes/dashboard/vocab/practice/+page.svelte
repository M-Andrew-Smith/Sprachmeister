<script lang="ts">
    import { studyWords, activeMode } from '$lib/stores/StudyStore';
    import { vocabStore } from '$lib/stores/TempStorage';
    import { fade, fly, scale } from 'svelte/transition';
    import { Button } from "$lib/components/ui/button";
    import { Progress } from "$lib/components/ui/progress";
    import * as Card from "$lib/components/ui/card";
    import { Input } from "$lib/components/ui/input";
    import { Badge } from "$lib/components/ui/badge";
    import { ChevronLeft, Trophy, CheckCircle2, XCircle } from "lucide-svelte";
    import { goto } from '$app/navigation';

    // Svelte 5 States
    let currentIndex = $state(0);
    let isFlipped = $state(false);
    let userInput = $state('');
    let quizOptions = $state<string[]>([]);
    let feedback = $state<'correct' | 'wrong' | null>(null);
    let score = $state(0);
    let isFinished = $state(false);

    // Derived values
    let currentWord = $derived($studyWords[currentIndex]);
    let total = $derived($studyWords.length);
    let progressValue = $derived(total > 0 ? ((currentIndex + 1) / total) * 100 : 0);

    function generateQuizOptions() {
        if (!currentWord) return;
        const others = $vocabStore
            .filter(w => w.id !== currentWord.id)
            .map(w => w.english);
        const distractors = others.sort(() => 0.5 - Math.random()).slice(0, 3);
        quizOptions = [...distractors, currentWord.english].sort(() => 0.5 - Math.random());
    }

    $effect(() => {
        if (currentWord && $activeMode === 'quiz') {
            generateQuizOptions();
        }
    });

    function handleNext(isCorrect: boolean) {
        if (isCorrect) {
            score++;
            feedback = 'correct';
        } else {
            feedback = 'wrong';
        }

        setTimeout(() => {
            feedback = null;
            isFlipped = false;
            userInput = '';
            
            if (currentIndex < total - 1) {
                currentIndex++;
            } else {
                isFinished = true;
            }
        }, 800);
    }

    function toggleFlip() {
        isFlipped = !isFlipped;
    }
</script>

<div class="min-h-screen flex flex-col transition-colors duration-500 {feedback === 'correct' ? 'bg-green-50' : feedback === 'wrong' ? 'bg-red-50' : 'bg-slate-50'}">
    
    <header class="p-4 md:p-6 flex items-center gap-6 max-w-4xl mx-auto w-full">
        <Button variant="ghost" size="icon" onclick={() => goto('/dashboard/vocab')} class="shrink-0">
            <ChevronLeft class="h-6 w-6" />
        </Button>
        
        {#if !isFinished && total > 0}
            <div class="flex-1 space-y-2">
                <Progress value={progressValue} class="h-3" />
                <div class="flex justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
                    <span>Progress</span>
                    <span>{currentIndex + 1} of {total}</span>
                </div>
            </div>
        {/if}
    </header>

    <main class="flex-1 flex items-center justify-center p-6">
        {#if isFinished}
            <Card.Root class="max-w-md w-full text-center p-8 shadow-2xl border-none">
                <div class="flex justify-center mb-6">
                    <div class="bg-yellow-100 p-4 rounded-full">
                        <Trophy class="h-12 w-12 text-yellow-600" />
                    </div>
                </div>
                <h1 class="text-3xl font-black mb-2 text-slate-900">Session Complete!</h1>
                <p class="text-slate-500 mb-8 font-medium">You mastered {score} out of {total} words.</p>
                <div class="text-6xl font-black text-blue-600 mb-10">
                    {total > 0 ? Math.round((score/total) * 100) : 0}%
                </div>
                <Button class="w-full h-12 text-lg font-bold" onclick={() => goto('/dashboard/vocab')}>
                    Return to Hub
                </Button>
            </Card.Root>

        {:else if !currentWord}
            <div class="text-center space-y-4">
                <p class="text-slate-500 font-medium">No words selected for practice.</p>
                <Button variant="outline" onclick={() => goto('/dashboard/vocab')}>Go Pick Words</Button>
            </div>

        {:else}
            <div class="w-full max-w-2xl mx-auto h-[450px] relative">
                {#key currentIndex}
                    <div class="absolute inset-0" in:fly={{ y: 20, duration: 400 }}>
                        
                        {#if $activeMode === 'flashcards'}
                            <div 
                                role="button"
                                tabindex="0"
                                class="card-perspective h-full w-full cursor-pointer outline-none"
                                onclick={toggleFlip}
                                onkeydown={(e) => (e.key === 'Enter' || e.key === ' ') && toggleFlip()}
                            >
                                <div class="card-inner {isFlipped ? 'is-flipped' : ''}">
                                    <div class="card-face card-front bg-white shadow-xl border-2 border-slate-100 rounded-3xl flex flex-col items-center justify-center p-12">
                                        <Badge variant="secondary" class="mb-4 uppercase tracking-tighter">German</Badge>
                                        <h2 class="text-5xl font-black text-center text-slate-900">{currentWord.german}</h2>
                                        <p class="mt-8 text-slate-400 text-sm font-bold uppercase animate-pulse">Tap to flip</p>
                                    </div>
                                    <div class="card-face card-back bg-blue-600 shadow-xl rounded-3xl flex flex-col items-center justify-center p-12 text-white">
                                        <Badge variant="outline" class="mb-4 uppercase tracking-tighter text-blue-100 border-white/20">English</Badge>
                                        <h2 class="text-5xl font-black text-center">{currentWord.english}</h2>
                                        <div class="absolute bottom-8 flex gap-4 w-full px-8">
                                            <Button variant="secondary" class="flex-1 h-14 font-bold bg-white/10 hover:bg-white/20 text-white border-white/20" onclick={(e) => { e.stopPropagation(); handleNext(false); }}>
                                                Hard <XCircle class="ml-2 h-4 w-4" />
                                            </Button>
                                            <Button variant="secondary" class="flex-1 h-14 font-bold bg-white text-blue-600 hover:bg-blue-50" onclick={(e) => { e.stopPropagation(); handleNext(true); }}>
                                                Easy <CheckCircle2 class="ml-2 h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        {:else if $activeMode === 'quiz'}
                            <div class="space-y-8 h-full flex flex-col justify-center">
                                <div class="text-center space-y-2">
                                    <span class="text-blue-600 font-black uppercase tracking-widest text-xs">Translate this word</span>
                                    <h2 class="text-6xl font-black tracking-tighter text-slate-900">{currentWord.german}</h2>
                                </div>
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {#each quizOptions as option}
                                        <Button 
                                            variant="outline" 
                                            class="h-20 text-xl font-bold rounded-2xl border-2 hover:border-blue-500 hover:bg-blue-50 transition-all shadow-sm"
                                            onclick={() => handleNext(option === currentWord.english)}
                                        >
                                            {option}
                                        </Button>
                                    {/each}
                                </div>
                            </div>

                        {:else if $activeMode === 'spelling'}
                            <div class="space-y-12 h-full flex flex-col justify-center max-w-md mx-auto">
                                <div class="text-center space-y-2">
                                    <span class="text-blue-600 font-black uppercase tracking-widest text-xs">How do you say?</span>
                                    <h2 class="text-6xl font-black tracking-tighter text-slate-900">{currentWord.english}</h2>
                                </div>
                                <div class="space-y-4">
                                    <Input 
                                        class="h-16 text-2xl font-bold text-center rounded-2xl border-2 focus-visible:ring-blue-500 shadow-lg"
                                        placeholder="Type in German..."
                                        bind:value={userInput}
                                        onkeydown={(e) => e.key === 'Enter' && handleNext(userInput.trim().toLowerCase() === currentWord.german.toLowerCase())}
                                    />
                                    <Button class="w-full h-14 text-lg font-bold rounded-xl shadow-lg shadow-blue-200" onclick={() => handleNext(userInput.trim().toLowerCase() === currentWord.german.toLowerCase())}>
                                        Check Answer
                                    </Button>
                                </div>
                            </div>
                        {/if}

                    </div>
                {/key}
            </div>
        {/if}
    </main>
</div>

<style>
    /* Corrected reference path for SvelteKit structure */
    @reference "../../../layout.css";

    .card-perspective {
        perspective: 1000px;
    }

    .card-inner {
        position: relative;
        width: 100%;
        height: 100%;
        transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        transform-style: preserve-3d;
    }

    .is-flipped {
        transform: rotateY(180deg);
    }

    .card-face {
        position: absolute;
        width: 100%;
        height: 100%;
        backface-visibility: hidden;
        -webkit-backface-visibility: hidden;
    }

    .card-back {
        transform: rotateY(180deg);
    }
</style>
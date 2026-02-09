<script lang="ts">
    import { studyWords, activeMode } from '$lib/stores/StudyStore';
    import { vocabStore } from '$lib/stores/TempStorage';
    import { fade, fly } from 'svelte/transition';

    let currentIndex = 0;
    let isFlipped = false;
    let userInput = '';
    let quizOptions: string[] = [];
    let feedback: 'correct' | 'wrong' | null = null;
    let score = 0;
    let isFinished = false;

    $: currentWord = $studyWords[currentIndex];
    $: total = $studyWords.length;

    function focusOnMount(node: HTMLInputElement) {
        node.focus();
    }

    $: if (currentWord && $activeMode === 'quiz') {
        generateQuizOptions();
    }

    function generateQuizOptions() {
        const others = $vocabStore
            .filter(w => w.id !== currentWord.id)
            .map(w => w.english);
        const distractors = others.sort(() => 0.5 - Math.random()).slice(0, 3);
        quizOptions = [...distractors, currentWord.english].sort(() => 0.5 - Math.random());
    }

    function handleNext(isCorrect: boolean) {
        if (isCorrect) score++;
        feedback = isCorrect ? 'correct' : 'wrong';

        setTimeout(() => {
            feedback = null;
            isFlipped = false;
            userInput = '';
            
            if (currentIndex < total - 1) {
                currentIndex++;
            } else {
                isFinished = true;
            }
        }, 600);
    }

    function handleKeyDown(event: KeyboardEvent) {
        if ($activeMode === 'flashcards' && (event.key === 'Enter' || event.key === ' ')) {
            isFlipped = !isFlipped;
        }
    }
</script>

<div class="practice-arena" class:bg-correct={feedback === 'correct'} class:bg-wrong={feedback === 'wrong'}>
    <header>
        <a href="/dashboard/vocab" class="back-link">← Exit</a>
        {#if !isFinished}
            <div class="progress">
                <div class="bar" style="width: {(currentIndex + 1) / total * 100}%"></div>
            </div>
            <span class="count">{currentIndex + 1} / {total}</span>
        {/if}
    </header>

    <main class="content">
        {#if isFinished}
            <div class="summary-card" in:fly={{ y: 20 }}>
                <h1>Session Complete!</h1>
                <div class="score-circle">
                    <span class="score-num">{score}</span>
                    <span class="score-total">/ {total}</span>
                </div>
                <p>Great job! Your memory is getting stronger.</p>
                <a href="/dashboard/vocab" class="finish-btn">Back to Hub</a>
            </div>
        {:else if !currentWord}
            <div class="empty-state">
                <p>No words found for this session.</p>
                <a href="/dashboard/vocab">Return to Hub</a>
            </div>
        {:else}
            {#key currentIndex}
                <div in:fly={{ x: 20, duration: 400 }}>
                    {#if $activeMode === 'flashcards'}
                        <button type="button" class="card {isFlipped ? 'flipped' : ''}" on:click={() => isFlipped = !isFlipped} on:keydown={handleKeyDown}>
                            <p class="label">{isFlipped ? 'English' : 'German'}</p>
                            <h2>{isFlipped ? currentWord.english : currentWord.german}</h2>
                        </button>
                        {#if isFlipped}
                            <div class="controls" transition:fade>
                                <button class="btn-wrong" on:click={() => handleNext(false)}>Hard ❌</button>
                                <button class="btn-right" on:click={() => handleNext(true)}>Easy ✅</button>
                            </div>
                        {/if}

                    {:else if $activeMode === 'quiz'}
                        <div class="quiz-container">
                            <p class="label">Translate:</p>
                            <h2 class="prompt">{currentWord.german}</h2>
                            <div class="options-grid">
                                {#each quizOptions as option}
                                    <button class="option-btn" on:click={() => handleNext(option === currentWord.english)}>
                                        {option}
                                    </button>
                                {/each}
                            </div>
                        </div>

                    {:else if $activeMode === 'spelling'}
                        <div class="spelling-container">
                            <p class="label">Translate to German:</p>
                            <h2 class="prompt">{currentWord.english}</h2>
                            <input 
                                type="text" 
                                use:focusOnMount 
                                bind:value={userInput} 
                                placeholder="Type here..."
                                on:keydown={(e) => e.key === 'Enter' && handleNext(userInput.trim().toLowerCase() === currentWord.german.toLowerCase())}
                            />
                            <button class="submit-btn" on:click={() => handleNext(userInput.trim().toLowerCase() === currentWord.german.toLowerCase())}>
                                Check Answer
                            </button>
                        </div>
                    {/if}
                </div>
            {/key}
        {/if}
    </main>
</div>

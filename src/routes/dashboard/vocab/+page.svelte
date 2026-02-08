<script lang="ts">
    // This is where the Logic will eventually handle searching and grouping
</script>

<div class="vocab-dashboard">
    <header>
        <h1>My Vocabulary Hub</h1>
        <p>Manage your collected words and prepare for practice sessions.</p>
    </header>

    <div class="action-section">
        <div class="search-box">
            <input type="text" placeholder="Search your words..." />
            <p><small>Use this to quickly find a specific German term in your bank.</small></p>
        </div>

        <div class="add-manual-box">
            <button>+ Add New Word</button>
            <p><small>Found a word outside of our reading list? Add it manually here.</small></p>
        </div>
    </div>

    <hr />

    <div class="study-management">
        <section class="groups-container">
            <h2>Word Groups</h2>
            <button>Create New Group</button>
            <p><small>Organize words by theme, like "Food" or "Travel," to study them together.</small></p>
            
            <div class="group-list-placeholder">
                <button>Group: All Words</button>
                <button>Group: Recent from Reading</button>
            </div>
        </section>

        <section class="practice-launcher">
            <h2>Ready to Review?</h2>
            <a href="/dashboard/vocab/practice">
                <button style="padding: 20px; font-weight: bold;">START PRACTICE SESSION</button>
            </a>
            <p><small>Test your memory with Flashcards, Quizzes, and Spelling challenges.</small></p>
        </section>
    </div>
</div>
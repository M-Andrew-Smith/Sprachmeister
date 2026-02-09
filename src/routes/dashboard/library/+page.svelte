<script lang="ts">
    const articles = [
        { title: "Albert Einstein", slug: "Albert_Einstein" },
        { title: "Berlin", slug: "Berlin" },
        { title: "Kaffee (Coffee)", slug: "Kaffee" },
        { title: "Grimms Märchen", slug: "Brüder_Grimm" }
    ];
</script>

<div>
    <h1>Reading Library</h1>
    <p>Select a topic to read in German. Click words to translate them.</p>

    <ul>
        {#each articles as article}
            <li>
                <a href="/dashboard/read/{article.slug}">
                    <button>Read about {article.title}</button>
                </a>
            </li>
        {/each}
    </ul>
</div>
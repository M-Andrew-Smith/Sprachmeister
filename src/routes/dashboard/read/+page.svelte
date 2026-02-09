<script lang="ts">
    const genres = [
        {
            name: "Märchen",
            articles: [
                { title: "Der Froschkönig", slug: "Der_Froschkönig" },
                { title: "Rotkäppchen", slug: "Rotkäppchen" }
            ]
        },
        {
            name: "Berühmte Persönlichkeiten",
            articles: [
                { title: "Albert Einstein", slug: "Albert_Einstein" },
                { title: "Brüder Grimm", slug: "Brüder_Grimm" }
            ]
        },
        {
            name: "Städte & Kultur",
            articles: [
                { title: "Berlin", slug: "Berlin" },
                { title: "Kaffee", slug: "Kaffee" }
            ]
        }
    ];
</script>

<h1>Reading Library</h1>

<div class="filter-box">
    <button>Genre Filter</button>
</div>

<div class="library-container">
    {#each genres as genre}
        <section class="category-box">
            <h2>{genre.name}</h2> 
            <div class="item-grid">
                {#each genre.articles as article}
                    <a href="/dashboard/read/{article.slug}">
                        <button>{article.title}</button>
                    </a>
                {/each}
            </div>
        </section>
    {/each}
</div>

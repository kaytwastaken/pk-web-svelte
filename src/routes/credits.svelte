<svelte:head>
    <title>Credits | pk-web</title>
</svelte:head>

<div class="container">
    <div class="cardHolder">
        <div class="card">
            <h1>Website</h1>
            <small>If I'm not listing something I should please lmk!</small>
            <div class="grid">
                <a href="https://github.com/sveltejs/svelte">Svelte</a>
                <a href="https://github.com/sveltejs/kit">SvelteKit</a>
                <a href="https://github.com/pngwn/mdsvex">MDsveX</a>
                <a href="https://github.com/sass">Sass</a>
                <a href="https://github.com/rstacruz/nprogress">NProgress</a>
            </div>
        </div>
        <div class="card">
            <h1>Particularly helpful code and resources</h1>
            <div class="grid">
                <p><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy">Proxy Object docs on MDN</a></p>
                <p><code>src/api/index.ts</code> from <a href="https://github.com/Draconizations/pk-webs-svelte/blob/bf31b8c8a59d299291e6f4df00af398832b1388b/src/api/index.ts#L23">Draconizations' pk-webs-svelte</a></p>
            </div>
        </div>
        <div class="card">
            <h1>Other PK things</h1>
            <div class="grid">
                <p><a href="https://pluralkit.me/">PluralKit by xSke</a></p>
                <p><a href="https://pk.greysdawn.com/">PluralKit Web by Greysdawn</a></p>
                <p><a href="https://pk-webs.spectralitree.com/">pk-webs by Draconizations</a></p>
                <p><a href="https://pk-webs-beta.spectralitree.com/">pk-webs-svelte by Draconizations</a></p>
            </div>
        </div>
        <div class="card">
            <h1>Fonts used</h1>
            <div class="grid">
                <p><a href="https://fonts.google.com/specimen/Raleway">Raleway</a></p>
            </div>
        </div>
    </div>
</div>

<style lang='scss'>
    .container {
        height: calc(100vh - 5rem - 3rem);
    }
    .cardHolder {
        width: 50%;
        padding-bottom: 5rem;
        border-bottom: 2px solid $gray;
        @include xl-screen {
            width: 60%;
        }
        @include lg-screen {
            width: 70%;
        }
        @include md-screen {
            width: 80%;
        }
        @include sm-screen {
            width: 90%;
        }
    }
    .card {
        margin-top:1.5rem;
        p {
            max-width: 70%;
            margin-right: 1rem;
            @include sm-screen {
                // max-width: 30%;
            }
        }
    }
    .grid {
        display: grid;
        grid-template-columns: auto auto auto auto;
        @include xs-screen {
            grid-template-columns: auto auto auto;
        }
        margin-top: 1rem;
    }
    a {
        text-decoration: none;
    }
    a:hover {
        text-decoration: underline;
    }
</style>
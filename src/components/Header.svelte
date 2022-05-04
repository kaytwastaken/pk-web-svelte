<script lang='ts'>
    import { logout } from '$lib/user'
</script>

<header>
    <span class="home">
        <a href="/">pk-web-<em>svelte</em></a>
        <a href="/credits">Credits/Links</a>
        <a href="https://github.com/Kaytwastaken/pk-web-svelte" target="_blank" class="external">Source code</a>
    </span>
    <span class="nav">
        <a href="/profile">Profile</a>
        <a href="/public">Public</a>
        <a href="/" id="logout" on:click={logout}>Logout</a>
    </span>
</header>

<style lang='scss'>
    $header-space: 4rem;
    
    header {
        height: 5rem;
        padding: 0 calc($header-space / 2) 0 calc($header-space / 2);
        display: flex;
        flex-direction: row;
        align-items: center;
        @include xs-screen {
            flex-direction: column;
            align-items: flex-start;
            margin-top: 1rem;
        }
    }
    a {
        text-decoration: none;
        margin-right: 2rem;
        color: $text;
    }
    a:hover {
        padding-bottom: 4px;
        border-bottom: 2px $blue solid;

    }
    a#logout:hover{
        color: $red;
        border-bottom-color: $red;
    }
    a.external:hover{
        border-bottom-color: $orange;
    }
    em {
        color: $orange
    }
    span {
        height: 3rem;
        display: flex;
        flex-direction: row;
        align-items: center;
    }
    span :last-child {
        margin-right: 0 !important;
    }
    .home {
        @include xs-screen {
            width: 100%;
            display: grid;
            grid-template-columns: auto auto auto;
            justify-items: center;
        }
    }
    .nav {
        margin-left: auto;
        @include xs-screen {
            margin-left: 0;
            width: 100%;
            display: grid;
            grid-template-columns: auto auto auto;
            justify-items: center;
        }
    }
</style>
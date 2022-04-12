<script lang='ts'>
    import { logout } from '$lib/user'
</script>

<header>
    <span class="home">
        <a href="/">pk-web</a>
        <a href="https://github.com/Kaytwastaken/pk-web-svelte" id="source" target="_blank">Source code</a>
    </span>
    <span class="nav">
        <a href="/profile">Profile</a>
        <a href="/public">Public</a>
        <a href="/" id="logout" on:click={() => {logout(); console.log('logout button?')}}>Logout</a>
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
            // padding-left: ;
        }
    }
    h1 {
        small {
            font-size: 1rem;
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
    a#source:hover{
        // color: $blue;
        border-bottom-color: $orange;
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
    .nav {
        margin-left: auto;
        @include xs-screen {
            margin-left: 0;
        }
    }
</style>
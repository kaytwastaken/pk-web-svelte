<script lang="ts">
    import { goto } from "$app/navigation";
    let input = ''

    // Reload page
    function retry() {
        goto(`/profile/${input}`)
    }
</script>

<svelte:head>
    <title>View public information | pk-web</title>
</svelte:head>

<div class="container">
    <div>
        <h1>Enter a 5-letter system ID or an 18 character Discord User ID</h1>
        <form on:submit|preventDefault={retry}>
            <input type="text" name="input" placeholder="System ID" bind:value={input}>
            <input disabled={input.length != 5 && input.length != 18} type="submit" class="submit">
        </form>
    </div>
</div>

<style lang='scss'>
    .container {
        height: 80vh;
        max-width: 100vw;
        height: calc(100vh - 5rem - 3rem);
    }
    form {
        margin-top: 1rem;
        // width: 100%;
        display: flex;
        flex-direction: row;
        padding: 1rem;
    }
    input[type=text] {
        flex-grow: 1;
    }
    input[type=submit] {
        margin: 0 0 0 1rem
    }
    h1 {
        @include md-screen {
            margin-left: 1rem;
            margin-right: 1rem;
        }
    }
</style>
<!-- <script lang="ts" context="module">
    // Disable client side router to reload page on refetch
    export const router = false
</script> -->

<script lang="ts">
    import { goto } from "$app/navigation";
    let input = ''

    // Reload page
    function retry() {
        // console.log(input)
        goto(`/profile/${input}`)
    }
</script>

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
</style>
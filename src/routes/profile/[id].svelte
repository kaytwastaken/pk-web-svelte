<script lang="ts" context="module">
    // Disable client side router to reload page on refetch
    export const router = false
    
    // Load params from URL
    export async function load({ params }) {
        return {
            props: {
                params: params
            }
        }
    }
</script>

<script lang="ts">
    import { goto } from "$app/navigation";
    import Profile from '../../components/Profile.svelte'

    // Grab params from module script on server
    export let params
    
    let input = ''

    // Reload page
    function retry() {
        goto(`/profile/${input}`)
    }
</script>

<div class="container">
    <!-- If params is not a 5 character id or discord id then return warning and resubmit form --> 
    {#if params.id.length != 5 && params.id.length != 18}
        <h1>Please enter a 5-letter system ID or an 18 character Discord User ID</h1>
        <form on:submit|preventDefault={retry}>
            <input type="text" name="input" placeholder="System ID" bind:value={input}>
            <input disabled={input.length != 5 && input.length != 18} type="submit" class="submit">
        </form>
    <!-- Else load the normal resubmit form -->
    {:else}
        <form on:submit|preventDefault={retry}>
            <label for="input">Load a different system with its 5-letter id or an 18 character Discord User ID</label>
            <span>
                <input type="text" name="input" placeholder="System ID" bind:value={input}>
                <input disabled={input.length != 5 && input.length != 18} type="submit" class="submit">
            </span>
        </form>
        <!-- Load the profile component -->
        <Profile id={params.id} token={null}/>
    {/if}
</div>

<style lang="scss">
    .container {
        align-items: center;
    }
    h1 {
        width: 80vw;
        text-align: center;
    }
    form {
        margin-top: 0 !important;
    }
    span {
        display: flex;
    }
    label {
        margin: 1rem 0 0 0;
    }
    input[type=text] {
        margin: 0 .5rem 0 0;
        width: calc(100% - 7rem);
    }
    input[type=submit] {
        margin: 0;
    }
</style>
<script lang="ts" context="module">
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

<!-- Use key block to force rerender on params change :D -->
<!-- https://www.reddit.com/r/sveltejs/comments/u7tvzi/any_way_to_force_a_complete_rerender/ -->
<!-- https://svelte.dev/docs#template-syntax-key -->
{#key params}
    <div class="container">
        <!-- If params is not a 5 character id or discord id then return warning and resubmit form --> 
        {#if params.id.length != 5 && params.id.length != 18}
            <h1>Please enter a 5-letter system ID or an 18 character Discord User ID</h1>
            <form on:submit|preventDefault={retry}>
                <input type="text" name="input" placeholder="System ID" bind:value={input}>
                <input
                    disabled={input.length != 5 && input.length != 18}
                    type="submit"
                    class="submit"
                    value="Submit"
                >
            </form>
        <!-- Else load the normal resubmit form -->
        {:else}
            <form on:submit|preventDefault={retry}>
                <label for="input">Load a different system with its 5-letter id or an 18 character Discord User ID</label>
                <span>
                    <input type="text" name="input" placeholder="System ID" bind:value={input}>
                    <input
                        disabled={input.length != 5 && input.length != 18}
                        type="submit"
                        class="submit"
                        value="Submit"
                    >
                </span>
            </form>
            <!-- Load the profile component -->
            <Profile id={params.id} token={null}/>
        {/if}
    </div>
{/key}

<style lang="scss">
    h1 {
        width: 80vw;
        text-align: center;
    }
    form {
        margin-bottom: 1rem;
    }
    span {
        display: flex;
    }
    label {
        margin: 1rem 0 0 0;
        @include xs-screen {
            width: 90%;
            margin: 1rem auto 0 auto
        }
    }
    input[type=text] {
        margin: 0 .5rem 0 0;
        width: calc(100% - 7rem);
        @include xs-screen {
            width: 60%;
            margin: 0 .5rem 0 auto;
        }
    }
    input[type=submit] {
        margin: 0;
        @include xs-screen {
            margin: 0 auto 0 auto;
        }
    }
</style>
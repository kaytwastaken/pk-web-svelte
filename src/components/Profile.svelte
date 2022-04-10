<script lang="ts">
    export let token:string
    export let id:string
    
    import type { System, Member } from '../lib/types'
    import pk from '../lib/pk'
    import { goto } from '$app/navigation';

    import SystemCard from './System.svelte'
    import MemberCard from './Members.svelte'

    let system:System
    let members:Array<Member>

    // If no token is passed (for public info) set auth to false
    token ?? {auth: false}

    // Define functions to fetch info
    const systemFetch = async () => {
        system = await pk().systems(id).get({ token })
    }
    const memberFetch = async () => {
        members = await pk().systems(id).members.get({ token })
    }

    // Map functions to promise aliases to be used when reloading page content
    let systemPromise = systemFetch()
    let memberPromise = memberFetch()

    // Reload info using promise aliases
    function reload(id = null) {
        if (id != null) {
            goto(`/profile/${id}`)
        }
        systemPromise = systemFetch()
        memberPromise = memberFetch()
    }

</script>

<div class="container">    
    <!-- Wait for system info to return -->
    {#await systemPromise}
        <h1>Loading system...</h1>
    {:then} 
        <SystemCard system={system}></SystemCard>
    {/await}

    <span class="hr"></span>

    <!-- Wait for member info to return -->
    {#await memberPromise}
        <h1>Loading members...</h1>
        {:then}
        <!-- Map each member to a card -->
        <div class="members">
            {#each members as member}
                <MemberCard member={member}></MemberCard>
            {/each}
        </div>
    
        <!-- Return the error -->
        {:catch error}
        <h1 class="err">{error.code == 429 ? 'Too many requests, try again.' : `${error.message}`}</h1>
        <form on:submit|preventDefault={error.code == 429 ? () => {reload()} : () => {reload(id)}}>
            <input
                type="text"
                bind:value={id}
                style="display: {error.code == 429 || 403 ? 'none' : 'unset'};"
            >
            <input
                type="submit"
                disabled={id.length != 5 && id.length != 18 && error.code != 429}
                style="display: {error.code == 403 ? 'none' : 'unset'};"
            >
        </form>
    
    {/await}
</div>


<style lang="scss">    
    .hr {
        width: 70vw;
        border-bottom: 3px solid $gray;
        margin: 1rem 0 2rem 0;
    }
    .container {
        align-items: center;
    }
    .err {
        width:50vw;
    }
    .system {
        margin-top: 1rem;
    }
    button {
        width: 5rem;
        margin-top: 1rem;
        background: $blue;
        padding: .5rem;
        border: none;
        border-radius: 5px;
        font-size:medium;
        font-weight: bold;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }
    form {
        margin-top: 1rem !important;
        flex-direction: row;
    }
    button:disabled {
        opacity: .6;
    }
    input[type=text] {
        margin: 1rem 0 .5rem 0;
    }
    input[type=text] {
        margin: 0 .5rem 0 0;
        width: calc(100% - 7rem);
    }
    input[type=submit] {
        margin: 0;
    }
</style>
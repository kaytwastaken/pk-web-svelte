<script lang="ts">
    export let token
    export let id:string
    
    import { currentUser, memberList } from '$lib/stores';
    import type { System, Member } from '../lib/types'
    import pk from '../lib/pk'
    import { goto } from '$app/navigation';

    import SystemCard from './System.svelte'
    import MemberCard from './Members.svelte'
    import NewMember from './NewMember.svelte'
    import DeleteModal from './DeleteModal.svelte'
    
    // Subcribe to the currentUser and memberList stores
    let user
    currentUser.subscribe(value => {
        user = value
    })
    let members:Array<Member>
    memberList.subscribe(value => {
        members = value
    })

    // If no token is passed (for public info) set needAuth to false and pass {auth:false}
    let needAuth = true
    if (!token) {
        // Set token to the {auth:false} object to fetch public information
        token = {auth:false}
        needAuth = false
    }

    // Define functions to fetch info
    let system:System
    let systemName

    const memberFetch = async () => {
        memberList.set(await pk().systems(id).members.get({ token }))
    }
    const systemFetch = async () => {
        if ( user != null && needAuth == true ) { system = user }
        else { system = await pk().systems(id).get({ token }) }
        systemName = system.name
    }
    
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

<svelte:head>
    <title>{needAuth
    ? systemName ?? "Loading..."
    : systemName ?? id} | pk-web</title>
</svelte:head>

<DeleteModal />

<div class="container">    
    {#await systemPromise}
        <h1>Loading system...</h1>
    {:then} 
        <SystemCard system={system} members={members} needAuth={needAuth}></SystemCard>
    {/await}

    <span class="hr"></span>

    <!-- Wait for member info to return -->
    {#await memberPromise}
        <h1>Loading members...</h1>
    {:then}
        <div class="members">
            {#if needAuth}
                <NewMember />
            {/if}
            {#key members}
                {#each members as member}
                    <MemberCard member={member} needAuth={needAuth}></MemberCard>
                {/each}
            {/key}
        </div>
    
    {:catch error}
        <h1 class="err" style="text-align: center;">{error.code == 429 ? 'Too many requests, try again.' : `${error.message}`}</h1>
        <form on:submit|preventDefault={error.code == 429 ? () => {reload()} : () => {reload(id)}}>
            <input
                type="text"
                bind:value={id}
                style="display: {error.code == 429 || error.code == 403 || error.code == 404 ? 'none' : 'unset'};"
            >
            <input
                type="submit"
                disabled={id.length != 5 && id.length != 18 && error.code != 429 && error.code != 500}
                style="display: {error.code == 403 || error.code == 404 ? 'none' : 'unset'};"
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
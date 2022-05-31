<script lang="ts">
    export let token
    export let id:string
    
    import { currentUser, memberList, groupList } from '$lib/stores';
    import type { System, Member, Group } from '../lib/types'
    import pk from '../lib/pk'
    import { goto } from '$app/navigation';

    import SystemCard from './System.svelte'
    import MemberCard from './Members.svelte'
    import GroupCard from './Group.svelte'
    import NewMember from './NewMember.svelte'
    import DeleteModal from './DeleteModal.svelte'
    
    // Subcribe to the currentUser and memberList stores
    let user:System
    currentUser.subscribe(value => {
        user = value
    })
    let members:Array<Member>
    memberList.subscribe(value => {
        members = value
    })
    let groups:Array<Group>
    groupList.subscribe(value => {
        groups = value
    })

    // Var for handling API errors
    let error = null

    // If no token is passed (for public info) set needAuth to false and pass {auth:false}
    let needAuth = true
    if (!token) {
        // Set token to the {auth:false} object to fetch public information
        token = {auth:false}
        needAuth = false
    }

    let showMembers = true
    let showGroups = false

    // Define functions to fetch info

    let systemName

    const memberFetch = async () => {
        memberList.set(await pk().systems(id).members.get({ token }).catch((err) => {error = err; console.log('memfetch error'); throw err}))
    }
    const groupFetch = async () => {
        console.log('group fetch')
        if (groups.length == 0) {
            console.log('groups null');
            
            groupList.set(await pk().systems(id).groups.get({ token:token, query:{"with_members": true} }).catch((err) => {error = err; console.log('groupfetch error'); throw err}))
            return
        }
        console.log('creating new promise');
        
        groupPromise = new Promise<void>((resolve) => {
            resolve()
        })

    }
    const systemFetch = async () => {
        user = await pk().systems(id).get({ token }).catch((err) => {error = err; console.log('sysfetch error'); throw err})
        systemName = user.name
    }
    
    let systemPromise
    let memberPromise
    let groupPromise

    // Reload info using promise aliases
    function reload(id = null) {
        error = null
        if (id != null) {
            goto(`/profile/${id}`)
        }
        systemPromise = systemFetch()
        memberPromise = memberFetch()
    }

    systemPromise = systemFetch()
    memberPromise = memberFetch()
    groupList.set([])

</script>

<svelte:head>
    <title>{needAuth
    ? systemName ?? "Loading..."
    : systemName ?? id} | pk-web</title>
</svelte:head>

<DeleteModal />

<div class="container">    
    {#if error}
        <h1 class="err">{error.code == 429 ? 'Too many requests, try again.' : `${error.message}`}</h1>
        <form on:submit|preventDefault={error.code == 429 || error.code == 'ERR_NETWORK' ? () => {reload()} : () => {reload(id)}}>
            <input
                type="text"
                name="id"
                id="id"
                bind:value={id}
                style="display:{error.code == 429 || error.code == 'ERR_NETWORK' ? 'none' : 'unset'}"
            >
            <input
                type="submit"
                value="Retry"
            >
        </form>
    {/if}
    
    {#await systemPromise}
        <h1>Loading system...</h1>
    {:then} 
        <SystemCard system={user} members={members} needAuth={needAuth}></SystemCard>
    {/await}
    
    <div class="buttons">
        <button disabled={showMembers} on:click={() => {showMembers = true; showGroups = false;}}>
            Members
        </button>
        <button disabled={showGroups} on:click={() => {showMembers = false; showGroups = true; groupPromise = groupFetch()}}>
            Groups
        </button>
    </div>

    <span class="hr"></span>


    <!-- Wait for member info to return -->
    {#if showMembers}
        {#await memberPromise}
            <h1 id="fuck">Loading members...</h1>
        {:then}
            <div class="members">
                {#if needAuth}
                    <NewMember />
                {/if}
                {#key members}
                    {#each members as member}
                        <MemberCard member={member} needAuth={needAuth}/>
                    {/each}
                {/key}
            </div>
        {:catch}
            <div></div>
        {/await}
    {/if}

    {#if showGroups}
        {#await groupPromise}
            <h1>Loading groups...</h1>
        {:then}
            <div class="groups">
                {#if needAuth}
                    <!-- TODO add new group button -->
                {/if}
                {#key groups}
                    {#each groups as group}
                        <GroupCard group={group} needAuth={needAuth}/>
                    {/each}
                {/key}
            </div>
        {:catch}
            <div></div>
        {/await}
    {/if}
</div>


<style lang="scss">    
    .hr {
        width: 70vw;
        @include descending-width;
        border-bottom: 3px solid $gray;
        margin: 1rem 0 2rem 0;
    }
    .container {
        align-items: center;
    }
    .err {
        width:50vw;
        text-align: center;
    }
    .system {
        margin-top: 1rem;
    }
    button {
        width: unset;
        background: $blue;
        padding: .5rem;
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
    .buttons {
        width: 70vw;
        @include descending-width;
        margin: 0 auto -1rem auto;

    }
</style>
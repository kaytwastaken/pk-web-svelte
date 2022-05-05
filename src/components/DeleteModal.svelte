<script lang=ts>
    import { memberList, deleteFlow } from "$lib/stores";
    import type { Member } from '$lib/types'
    import pk from '$lib/pk'
    import { onMount } from "svelte";

    let delFlow: { member: any; visibility: any; }
    let memList: Array<Member>
    let input: string
    let token: string
    let err = null
    let loading = false
    let loadMsg = ''

    onMount(() => {
        token = localStorage.getItem('token')
    })
    
    deleteFlow.subscribe(value => {
        delFlow = value
    })

    memberList.subscribe(value => {
        memList = value
    })

    function cancel () {
        console.log("canceled")
        console.log()
        deleteFlow.set({
            visibility: false,
            member: null
        })
    }

    async function deleteMember () {
        loading = true
        loadMsg = 'Deleting member...'
        try {
            await pk().members(delFlow.member.id).delete({ token })
        } catch (error) {
            err = error
            return
        }
        
        // Remove member from memList
        memList.splice(memList.indexOf(delFlow.member), 1)
        // Set memberList to shortened list (rerenders member cards)
        memberList.set(memList)
        // Close the modal
        deleteFlow.set({
            visibility: false,
            member: null
        })

        loading = false
        loadMsg = null
    }

</script>

{#if delFlow.visibility}
    <div class="container">
        <div id="delModal">
            <h2 style="margin-bottom: 1rem;">Are you sure you want to delete {delFlow.member.name}? <em>This cannot be undone!</em></h2>
            <p class="err">{err ?? ''}</p>
            <p class="load">{loading ? loadMsg : ''}</p>
            <label for="id">Input {delFlow.member.name}'s id ({delFlow.member.id}) to continue.</label>
            <div>
                <span>
                    <input type="text" name="id" id="id" bind:value={input}>
                    <button id="cancel" on:click={cancel}>
                        Cancel
                    </button>
                    <button id="delete" disabled={input == delFlow.member.id ? false : true} on:click={() => {deleteMember()}}>
                        Delete
                    </button>
                </span>
            </div>
        </div>
    </div>
{/if}

<style lang=scss>
    .container {
        position: fixed;
        display: flex;
        top: 0;
        left: 0;
        height: 100vh;
        width: 100vw;
        z-index: 100;
        // background-color: change-color($color: $gray,  $alpha: .5);
    }
    #delModal {
        padding: 5rem;
        background-color: $gray-2;
        border-radius: 1rem;
    }
    input {
        margin: .5rem .5rem .5rem 0 !important;
    }
    
    // Button styles
    button {
        margin: .5rem !important;
    }
    #cancel {
        background-color: $orange;
        @include xs-screen {
            position: relative;
            top: -2.6rem;
        }
    }
    #cancel:hover {
        background-color: $orange-2;
    }
    #delete {
        background-color: $red;
        @include xs-screen {
            position: relative;
            top: -2.6rem;
        }
    }
    #delete:hover {
        background-color: $red-2;
    }
    #delete:disabled {
        background: none !important;
        border: 1px solid $red;
        color: $red;
    }
    .err, .load {
        margin-bottom: 1rem;
        font-size: larger;
        font-weight: 700;
    }
    .err {
        color: $red;
    }
    .load {
        color: $blue;
    }
</style>
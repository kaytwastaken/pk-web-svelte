<script lang=ts>
    import { onMount } from "svelte";
    // Mine
    import { memberList, deleteFlow } from "$lib/stores";
    import pk from '$lib/pk'

    let input: string
    let token: string
    let err = null
    let loading = false
    let loadMsg = ''

    onMount(() => {
        token = localStorage.getItem('token')
    })

    function cancel () {
        input = null
        deleteFlow.set({
            visibility: false,
            member: null
        })
    }

    async function deleteMember () {
        loading = true
        loadMsg = 'Deleting member...'
        try {
            // Delete member
            await pk().members($deleteFlow.member.id).delete({ token })
        } catch (error) {
            err = error
            return
        }
        
        // Remove member from $memberList
        $memberList.splice($memberList.indexOf($deleteFlow.member), 1)
        // Set memberList to shortened list (rerenders member cards)
        memberList.set($memberList)

        // Close and reset the modal
        input = null
        deleteFlow.set({
            visibility: false,
            member: null
        })

        loading = false
        loadMsg = null
    }

</script>

<!-- {#if $deleteFlow.visibility && NProgress.status != 1} -->
{#if $deleteFlow.visibility}
    <div class="container">
        <div id="delModal">
            <h2 style="margin-bottom: 1rem;">Are you sure you want to delete {$deleteFlow.member.name}? <em>This cannot be undone!</em></h2>
            <p class="err">{err ?? ''}</p>
            <p class="load">{loading ? loadMsg : ''}</p>
            <label for="id">Input {$deleteFlow.member.name}'s id ({$deleteFlow.member.id}) to continue.</label>
            <div>
                <span class="inputs">
                    <input type="text" name="id" id="id" bind:value={input}>
                    <span>
                        <button id="cancel" on:click={cancel}>
                            Cancel
                        </button>
                        <button id="delete" disabled={input == $deleteFlow.member.id ? false : true} on:click={() => {deleteMember()}}>
                            Delete
                        </button>
                    </span>
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
    }
    #delModal {
        padding: 5rem;
        background-color: $gray-2;
        border: 2px solid $gray;
        border-radius: 1rem;
        max-width: 50vw;
        @include xs-screen {
            padding: 2rem;
            max-width: 70vw;
        }
    }
    .inputs {
        @include xs-screen {
            flex-direction: column;
        }
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
            margin: 0 .5rem 0 0 !important;
        }
    }
    #cancel:hover {
        background-color: $orange-2;
    }
    #delete {
        background-color: $red;
        @include xs-screen {
            margin: 0 .5rem 0 0 !important;
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
<script lang="ts">
    export let system:System
    export let members:Array<Member>
    export let needAuth:boolean
    
    import type { System, WriteSystem, Member } from '$lib/types'
    import dateFormat from 'dateformat'
    import pk from '$lib/pk';
    import { onMount } from 'svelte';

    let token
    let edit = false

    let sys:WriteSystem = {
        name: system.name,
        description: system.description,
        tag: system.tag,
        avatar_url: system.avatar_url,
        banner: system.banner,
        color: system.color,
        pronouns: system.pronouns,
        // privacy: SysPrivacy
    }

    onMount(() => {
        token = localStorage.getItem('token')
    })
    
    function expandTray () {
        document.getElementById(`${system.id}-tray`).classList.toggle('hidden')
    }

    async function toggleEdit (cancel = false) {
        if (!edit) {
            edit = true
        } else {
            if (!cancel) {
                // Save information to PK with a patch request
                await pk().systems('@me').patch({ data: sys, token: token})
                // Reassign system to a new API call to get updated information
                system = await pk().systems('@me').get({ token })
                edit = false
            }
            edit = false
        }

    }
</script>

<!-- Return a div to contain passed system information -->
<div class="cardHolder" style="border-bottom: {system.color ? `3px solid #${sys.color}` : 'none'};">
    {#if !edit}
        <div class="system" on:click={expandTray}>
            <span class="systemHeader">
                <img src={system.avatar_url} alt="" height="64px" style="border-radius: 9999px;">
                <div>
                    <span>
                        <h1 class="name">{system.name}</h1>
                        <p>|</p>
                        <p>{system.tag ?? "No tag set"}</p>
                    </span>
                    <span>
                        <small>{system.id}</small>
                        <p>|</p>
                        <small>{system.pronouns ?? "No pronouns set"}</small>
                    </span>
                </div>
                {#if needAuth}
                    <button on:click={() => {toggleEdit()}}>
                        Edit
                    </button>
                {/if}
            </span>
        </div>
        <div class="tray hidden" id="{system.id}-tray">
            {#if system.banner}
                <img src={sys.banner} alt="">
            {/if}
            <p>Registered: <code>{dateFormat(system.created, "dddd, mmmm dS, yyyy")}</code> at <code>{dateFormat(system.created, "h:MM:ss TT")}</code></p>
            {#if members}
                <p>Members: {members.length}</p>
            {/if}
            <p>Name: {system.name ?? "N/A"}</p>
            <p>Tag: {system.tag ?? "N/A"}</p>
            <p>Pronouns: {system.pronouns ?? "N/A"}</p>
            <p>Color: {system.color ?? "N/A"}</p>
            <div>
                <p>
                    {system.description ?? "No description set"}
                </p>
            </div>
        </div>
    {:else}
        <div class="system">
            <span class="systemHeader">
                <img src={sys.avatar_url} alt="" height="64px" style="border-radius: 9999px;">
                
                <div>
                    <span>
                        <h1 class="name">{sys.name}</h1>
                        <p>|</p>
                        <p>{sys.tag}</p>
                    </span>
                    <span>
                        <small>{system.id}</small>
                        <p>|</p>
                        <small>{sys.pronouns}</small>
                    </span>
                </div>
                
                <span class="buttons">
                    <button id="save" on:click={() => {toggleEdit()}}>
                        Save
                    </button>
                    <button id="cancel" on:click={() => {toggleEdit(true)}}>
                        Cancel
                    </button>
                </span>
            </span>
        </div>
        <div class="tray" id="{system.id}-tray">
            <p class="editField">Registered: <code>{dateFormat(system.created, "dddd, mmmm dS, yyyy")}</code> at <code>{dateFormat(system.created, "h:MM:ss TT")}</code></p>
            {#if members}
            <p>Members: {members.length}</p>
            {/if}
            <span> <p>Name: </p> <input type="text" name="name" id="name" placeholder={system.name ?? "System name"} bind:value={sys.name}> </span>
            <span> <p>Tag: </p> <input type="text" name="tag" id="tag" placeholder={system.tag ?? "System tag"} bind:value={sys.tag}> </span>
            <span> <p>Pronouns: </p> <input type="text" name="prns" id="prns" placeholder={system.pronouns ?? "System pronouns"} bind:value={sys.pronouns}> </span>
            <span> <p>Color: </p> <input type="text" name="color" id="color" placeholder={system.color ?? "System color"} bind:value={sys.color}> </span>
            <span> <p>Avatar URL: </p> <input type="text" name="pfp" id="pfp" placeholder={system.avatar_url ?? "System avatar URL"} bind:value={sys.avatar_url}> </span>
            <img src={sys.avatar_url} alt="" height="64px">
            <span> <p>Banner URL: </p> <input type="text" name="banner" id="banner" placeholder={system.banner ?? "System banner URL"} bind:value={sys.banner}> </span>
            <img class="banner" src={sys.banner} alt="">
            <div>
                <p style="margin-top: 1rem;">Description:</p>
                <textarea name="desc" id="desc" bind:value={sys.description}/>
            </div>
        </div>
    {/if}
</div>


<style lang="scss">
    .hidden {
        display: none;
    }
    .tray {
        padding: 1rem;
        border-radius: .5rem;
        p {
            white-space: pre-wrap;
            max-width: fit-content;
        }
        .banner {
            width: 50%;
            border-radius: .5rem;
            @include xl-screen {
                width: 60%;
            }
            @include lg-screen {
                width: 70%;
            }
            @include md-screen {
                width: 80%;
            }
            @include sm-screen {
                width: 90%;
            }
            @include xs-screen {
                width: 100%;
            }
        }
        img {
            margin-bottom: 1rem;
        }
    }
    
    .container {
        align-items: center;
    }
    .cardHolder {
        border-radius: .5rem;
        background: $gray;
        margin-bottom: 1rem;
        width: 70vw;
        max-width: 70vw;
        @include descending-width;
        @include descending-maximum;
    }
    .system {
        max-width: 70vw;
        @include descending-maximum;
        background: $gray;
        padding: 1rem;
        border-radius: .5rem;
    }
    .systemHeader {
        @include xs-screen {
            flex-direction: column;
            align-items: flex-start !important;
        }
    }
    h1.name {
        line-break: anywhere;
        @include md-screen {
            font-size: 1.5em;
        }
        @include sm-screen {
            font-size: large;
        }
        @include xs-screen {
            font-size: medium;
        }
    }
    span {
            display: flex;
            flex-direction: row;
            align-items: center;
            * {
                margin-right: .5rem !important;
            }
        }

    .buttons, button {
        margin-left: auto;
        margin-right: 0 !important;
        :last-child {
            margin-left: 1rem;
        }
        @include xs-screen {
            flex-direction: column;
            margin-left: 0 !important;
            margin-right: auto;
            align-items: flex-start !important;
        }
    }
    #save {
        background-color: $green;
    }
    #save:hover {
        background-color: $green-2;
    }
    #cancel {
        background-color: $red;
    }
    #cancel:hover {
        background-color: $red-2;
    }
    input {
        margin-left: auto !important;
        margin-right: 35% !important;
        width: 50%;
        @include xl-screen {
            margin-right: 30% !important;
        }
        @include lg-screen {
            margin-right: 25% !important;
        }
        @include md-screen {
            margin-right: 20% !important;
        }
        @include sm-screen {
            margin-right: 15% !important;
        }
        @include xs-screen {
            margin-right: 1% !important;
        }
    }
    textarea {
        height: 20rem;
        width: 50%;
        background-color: $gray-3;
        font-size: medium;
        padding: .5rem;
        @include xl-screen {
            width: 60%;
        }
        @include lg-screen {
            width: 70%;
        }
        @include md-screen {
            width: 80%;
        }
        @include sm-screen {
            width: 90%;
        }
        @include xs-screen {
            width: 95%;
        }
    }
    .system:hover {
        background: $gray-2;
    }
</style>
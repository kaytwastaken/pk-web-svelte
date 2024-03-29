<script lang="ts">
    export let system:System
    export let members:Array<Member>
    export let needAuth:boolean
    
    import { onMount } from 'svelte';
    import NProgress from 'nprogress'
    // Mine
    import type { System, WriteSystem, Member } from '$lib/types'
    import dateFormat from 'dateformat'
    import pk from '$lib/pk';
    import Privacy from './SystemPrivacy.svelte'
    import { validateSystem } from '$lib/validate'

    let token
    let edit = false
    let err
    let loading = false
    let loadMsg

    let sys:WriteSystem = {
        name: system.name,
        description: system.description,
        tag: system.tag,
        avatar_url: system.avatar_url,
        banner: system.banner,
        color: system.color,
        pronouns: system.pronouns,
        privacy: system.privacy
    }

    onMount(() => {
        token = localStorage.getItem('token')
    })
    
    function expandTray () {
        document.getElementById(`${system.id}-tray`).classList.toggle('hidden')
    }
    
    function cancel() {
        err = null
        edit = false
        loading = false
        loadMsg = null
    }
    
    async function saveData () {
        loading = true
        NProgress.configure({
            minimum: 0.1,
            speed: 300,
            trickle: true,
            trickleSpeed: 100,
            parent: `#system`,
            showSpinner: false,
        })
        NProgress.start()
        
        // Validate system data
        try {
            err = null
            loadMsg = 'Checking system data...'
            validateSystem(sys)
        } catch (error) {
            err = error
            loadMsg = null
            loading = false
            NProgress.done()
            return
        }
        
        // Save information to PK with a patch request
        loadMsg = '(1/2) Saving data...'
        NProgress.set(.3)
        await pk().systems('@me').patch({ data: sys, token: token})
        // Reassign system to a new API call to get updated information
        loadMsg = '(2/2) Refreshing data...'
        NProgress.set(.8)
        system = await pk().systems('@me').get({ token })
        
        // Exit edit mode
        edit = false
        loadMsg = null
        loading = false
        NProgress.done()
        return

    }
</script>

<!-- Return a div to contain passed system information -->
<div class="cardHolder" style="border-bottom: {system.color ? `3px solid #${sys.color}` : 'none'};">
    {#if !edit}
        <div class="system" on:click={expandTray}>
            <span class="systemHeader">
                {#if system.avatar_url}
                    <img src={system.avatar_url} alt="" height="64px" style="border-radius: 9999px;">
                {/if}
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
                    <button on:click={() => {edit = true}}>
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
            <span><p>Color: {system.color ?? "N/A"}</p> <span id='swatch' style="background-color: #{system.color};"></span></span>
            <span class="detail">
                <div>
                    <p>
                        {system.description ?? "No description set"}
                    </p>
                </div>
                {#if needAuth}
                    <Privacy edit={edit} sys={sys}/>
                {/if}
            </span>
        </div>
    {:else}
        <div id="system" class="system">
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
                    <button id="save" on:click={() => {saveData()}}>
                        Save
                    </button>
                    <button id="cancel" on:click={() => {cancel()}}>
                        Cancel
                    </button>
                </span>
            </span>
        </div>
        <div class="tray" id="{system.id}-tray">
            <p class="err">{err ?? ""}</p>
            <p class="load">{loading ? loadMsg : ""}</p>

            <p class="editField">Registered: <code>{dateFormat(system.created, "dddd, mmmm dS, yyyy")}</code> at <code>{dateFormat(system.created, "h:MM:ss TT")}</code></p>
            {#if members}
            <p>Members: {members.length}</p>
            {/if}
            <span> <p>Name: </p> <input type="text" name="name" id="name" placeholder={sys.name ?? "System name"} bind:value={sys.name}> </span>
            <span> <p>Tag: </p> <input type="text" name="tag" id="tag" placeholder={sys.tag ?? "System tag"} bind:value={sys.tag}> </span>
            <span> <p>Pronouns: </p> <input type="text" name="prns" id="prns" placeholder={sys.pronouns ?? "System pronouns"} bind:value={sys.pronouns}> </span>
            <span> <p>Color: </p> <input type="text" name="color" id="color" placeholder={sys.color ?? "System color"} bind:value={sys.color}> </span>
            <span id='swatch-edit' style="background-color: #{sys.color};"></span>
            <span> <p>Avatar URL: </p> <input type="text" name="pfp" id="pfp" placeholder={sys.avatar_url ?? "System avatar URL"} bind:value={sys.avatar_url}> </span>
            <img src={sys.avatar_url} alt="" height="64px">
            <span> <p>Banner URL: </p> <input type="text" name="banner" id="banner" placeholder={sys.banner ?? "System banner URL"} bind:value={sys.banner}> </span>
            <img class="banner" src={sys.banner} alt="">
            <span class="detail">
                <div>
                    <p style="margin-top: 1rem;">Description:</p>
                    <textarea name="desc" id="desc" bind:value={sys.description}/>
                </div>
                {#if needAuth}
                    <Privacy edit={edit} sys={sys}/>
                {/if}
            </span>
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
        #swatch, #swatch-edit {
            margin: auto 0 2px .5rem;
            display: block;
            width:3rem;
            height: calc(1rem - 4px);
            border-radius: 9999px;
        }
        #swatch-edit {
            margin: -.5rem auto calc(1rem - 20px) 0;
        }
        .detail {
            margin-top: 1rem;
            display: flex;
            align-items: flex-start;
            @include sm-screen {
                flex-direction: column;
                div {
                    margin-bottom: 1rem;
                }
            }
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
        width: 40rem;
        background-color: $gray-3;
        font-size: medium;
        padding: .5rem;
        @include xl-screen {
            width: 30rem;
        }
        @include lg-screen {
            width: 25rem;
        }
        @include md-screen {
            width: 20rem;
        }
        @include xs-screen {
            width: 100%;
        }
    }
    .system:hover {
        background: $gray-2;
    }
</style>
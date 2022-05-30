<script lang="ts">
    export let group:Group
    export let needAuth:boolean
    
    import { onMount } from 'svelte';
    import NProgress from 'nprogress'
    // Mine :)
    import { deleteFlow } from '$lib/stores';
    import type { Group, WriteGroup } from '$lib/types'
    // import Privacy from './MemberPrivacy.svelte'
    import pk from '$lib/pk';
    // import { validateMember, readableDOB } from '$lib/validate'

    let token
    let edit = false
    let err
    let loading = false
    let loadMsg
    
    let grp:WriteGroup = {
        name: group.name,
        display_name: group.display_name,
        color: group.color,
        icon: group.icon,
        banner: group.banner,
        description: group.description,
        privacy: group.privacy,
        members: group.members,
    }

    onMount(() => {
        token = localStorage.getItem('token')
    })

    function expandTray () {
        if ( !edit ) {
            document.getElementById(`${group.id}-tray`).classList.toggle('hidden')
        }
    }

    function cancel () {
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
            parent: `#${group.id}`,
            showSpinner: false,
        })
        NProgress.start()
        
        // Validate member data
        try {
            err = null
            loadMsg = 'Checking member data...'
            // validateMember(grp)
        } catch (error) {
            err = error
            loading = false
            loadMsg = null
            NProgress.done()
            return
        }
        
        // Save information to PK with a patch request
        loadMsg = '(1/2) Saving data...'
        NProgress.set(.3)
        // await pk().members(group.id).patch({data: grp, token: token})
        // Reassign member to the response from a new API call to update information
        loadMsg = '(2/2) Refreshing data...'
        NProgress.set(.8)
        // group = await pk().members(group.id).get({ token })
        
        // Exit edit mode
        edit = false
        loading = false
        loadMsg = null
        NProgress.done()
        return
    }
    
    // Danger zone :O
    function startDelete () {
        deleteFlow.set({visibility: true, member: group})
    }

</script>

<!-- Return a div to be used in {#each} block on the profile page -->
<div class="cardHolder" style="border-bottom: {grp.color ? `3px solid #${grp.color}` : 'none'};">
    {#if !edit}
        <div id={group.id} class="memberCard" on:click = {expandTray}>
            <!-- Horizontal container -->
            <span class="memberHeader">
                {#if group.icon}
                    <img src={group.icon} alt="" height="64px" style="border-radius: 9999px;">
                {/if}
                <!-- Vertical container -->
                <div>
                    <!-- Horizontal container -->
                    <span>
                        <h2 class="name">{group.name}</h2>
                        <p>|</p>
                        <p>{group.display_name ?? "No display name set"}</p>
                    </span>
                    <!-- Horizontal container -->
                    <span>
                        <small>{group.id}</small>
                        <p>|</p>
                        <p>{group.members.length == 1 ? `1 member` : `${group.members.length} members`}</p>
                    </span>
                </div>
                {#if needAuth}
                    <button on:click={() => {edit = true}}>
                        Edit
                    </button>
                {/if}
            </span>
        </div>
        <div class="tray hidden" id="{group.id}-tray">
            <div style="margin-bottom: 1rem;">
                {#if group.banner}
                    <img class="banner" src={group.banner} alt="">
                {/if}
                <p>Name: {group.name ?? "N/A"}</p>
                <p>Display name: {group.display_name ?? "N/A"}</p>
                <span><p>Color: {group.color ?? "N/A"}</p> <span id='swatch' style="background-color: #{group.color};"></span></span>
            </div>
            <span class="detail">
                <div>
                    Description:
                    <p>{group.description ?? "No description set."}</p>
                </div>
                {#if needAuth}
                    <!-- <Privacy edit={edit} mem={grp}/> -->
                {/if}
            </span>
        </div>
    
    {:else}
    
        <div id={group.id} class="memberCard">
            <!-- Horizontal container -->
            <span class="memberHeader">
                <img src={grp.icon} alt="" height="64px" style="border-radius: 9999px; display: {group.icon == null ? 'none' : 'unset'};">
                <!-- Vertical container -->
                <div>
                    <!-- Horizontal container -->
                    <span>
                        <h2>{group.name}</h2>
                        <p>|</p>
                        <p>{group.display_name ?? "No display name set"}</p>
                    </span>
                    <!-- Horizontal container -->
                    <span>
                        <small>{group.id}</small>
                    </span>
                </div>
                <span class="buttons">
                    <button id="delete" on:click={() => {startDelete()}}>
                        Delete
                    </button>
                    <button id="cancel" on:click={() => {cancel()}}>
                        Cancel
                    </button>
                    <button id="save" on:click={() => {saveData()}}>
                        Save
                    </button>
                </span>
            </span>
        </div>
        <div class="tray" id="{group.id}-tray">
            <div style="margin-bottom: 1rem;">
                <p class="err">{err ?? ""}</p>
                <p class="load">{loading ? loadMsg : ""}</p>
                <span> <p>Name: </p> <input type="text" name="name" id="name" placeholder={group.name ?? "Name"} bind:value={grp.name}> </span>
                <span> <p>Display Name: </p> <input type="text" name="tag" id="tag" placeholder={group.display_name ?? "Display name"} bind:value={grp.display_name}> </span>
                <span> <p>Color: </p> <input type="text" name="color" id="color" placeholder={group.color ?? "Color"} bind:value={grp.color}> </span>
                <span id='swatch-edit' style="background-color: #{grp.color};"></span>
                <span> <p>Avatar URL: </p> <input type="text" name="pfp" id="pfp" placeholder={group.icon ?? "Avatar URL"} bind:value={grp.icon}> </span>
                <img src={grp.icon} alt="" height="64px">
                <span> <p>Banner URL: </p> <input type="text" name="banner" id="banner" placeholder={group.banner ?? "Banner URL"} bind:value={grp.banner}> </span>
                {#if grp.banner}
                    <img class="banner" src={grp.banner} alt="">
                {/if}
            </div>
            <span class="detail">
                <div>
                    <p style="margin-top: 1rem;">Description:</p>
                    <textarea name="desc" id="desc" bind:value={grp.description}/>
                </div>
                {#if needAuth}
                    <!-- <Privacy edit={edit} mem={grp}/> -->
                {/if}
            </span>
        </div>
    {/if}
</div>


<style lang="scss">
    .hidden {
        display: none;
        margin-top: 0;
    }
    .tray {
        padding: 1rem;
        border-radius: .5rem;
        .banner {
            width: 50%;
            border-radius: .5rem;
            @include xl-screen {
                width: 50%;
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
        div {
            margin-right: 2rem;
        }
        #swatch, #swatch-edit {
            margin: auto 0 2px .5rem;
            display: block;
            width:3rem;
            height: calc(1rem - 4px);
            border-radius: 9999px;
        }
        #swatch-edit {
            margin: -1rem auto calc(1rem - 12px) 0;
        }
        .detail {
            display: flex;
            @include md-screen {
                flex-direction: column;
                div {
                    margin-bottom: 1rem;
                }
            }
        }
        
    }
    
    span {
        display: flex;
        flex-direction: row;
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
    .memberCard {
        max-width: 70vw;
        @include descending-maximum;
        background: $gray;
        padding: 1rem;
        border-radius: .5rem;
        h1, h2, h3 {
            margin: 0;
        }
        h2.name {
            line-break: anywhere;
        }
        span {
            align-items: center;
            p, small, h2, img {
                margin-right: .5rem;
            }
        }
    }
    .memberHeader {
        button {
            margin-left: auto;
        }
        @include xs-screen {
            flex-direction: column;
            align-items: flex-start !important;
            button {
                margin-left: unset;
            }
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
    .buttons {
        margin-left: auto;
        :last-child {
            margin-right: 0 !important;
        }
        button {
            margin: .5rem;
        }
        @include xs-screen {
            // flex-direction: column;
            margin-left: 0;
            align-items: flex-start !important;
            :first-child {
                margin-left: 0;
            }
        }
    }
    #save {
        background-color: $green;
    }
    #save:hover {
        background-color: $green-2;
    }
    #cancel {
        background-color: $orange;
    }
    #cancel:hover {
        background-color: $orange-2;
    }
    #delete {
        background-color: $red;
        @include xs-screen {
            margin-top: .5rem;
        }
    }
    #delete:hover {
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
    .proxy-tag {
        align-items: center;
        input {
            margin: 5px !important;
        }
        input:hover {
            background-color: $gray-2;
        }
        :first-child {
            margin-left: 0px !important;
        }    
        button {
            background-color: $red;
        }
        button:hover {
        background-color: $red-2;
        }
    }
    textarea {
        height: 20rem;
        width: 35rem;
        background-color: $gray-3;
        font-size: medium;
        padding: .5rem;
        @include xl-screen {
            width: 25rem;
        }
        @include lg-screen {
            width: 18rem;
        }
        @include md-screen {
            width: 100%;
        }
    }
    .memberCard:hover {
        background-color: $gray-2;
    }
</style>
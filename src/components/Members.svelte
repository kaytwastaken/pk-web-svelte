<script lang="ts">
    export let member:Member
    export let needAuth:boolean
    export let style = ''
    export let group:string = null
    
    import dateFormat from 'dateformat'
    import { onMount } from 'svelte';
    import NProgress from 'nprogress'
    // Mine :)
    import { deleteFlow, memberList } from '$lib/stores';
    import type { Member, WriteMember } from '$lib/types'
    import Privacy from './MemberPrivacy.svelte'
    import pk from '$lib/pk';
    import { validateMember, readableDOB } from '$lib/validate'
    import { addProxy, deleteProxy } from '$lib/members'

    let token
    let edit = false
    let err
    let loading = false
    let loadMsg
    
    let mem:WriteMember = {
        name: member.name,
        display_name: member.display_name,
        color: member.color,
        birthday: member.birthday,
        pronouns: member.pronouns,
        avatar_url: member.avatar_url,
        banner: member.banner,
        description: member.description,
        proxy_tags: member.proxy_tags,
        privacy: member.privacy,
    }

    onMount(() => {
        token = localStorage.getItem('token')
    })

    let members:Array<Member>
    memberList.subscribe(value => {
        members = value
    })

    function expandTray () {
        if ( !edit ) {
            document.getElementById(`${member.id}${group ? `-${group}` : "" }-tray`).classList.toggle('hidden')
            // id="{member.id}{group ? `-${group}` : "" }-tray"
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
            parent: `#${member.id}`,
            showSpinner: false,
        })
        NProgress.start()
        
        // Validate member data
        try {
            err = null
            loadMsg = 'Checking member data...'
            validateMember(mem)
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
        await pk().members(member.id).patch({data: mem, token: token})
        // Reassign member to the response from a new API call to update information
        loadMsg = '(2/2) Refreshing data...'
        NProgress.set(.8)
        // Make API call to refresh data
        let tempMember = await pk().members(member.id).get({ token })
        // Delete old member data and replace it with the new data
        members.splice(members.indexOf(member), 1, tempMember)
        memberList.set(members)
        // Replace visible information with new info
        member = tempMember
        
        // Exit edit mode
        edit = false
        loading = false
        loadMsg = null
        NProgress.done()
        return
    }
    
    // Danger zone :O
    function startDelete () {
        deleteFlow.set({visibility: true, member: member})
    }

</script>

<!-- Return a div to be used in {#each} block on the profile page -->
<div class="cardHolder" style="border-bottom: {mem.color ? `3px solid #${mem.color}` : 'none'}; {style}">
    {#if !edit}
        <div id="{member.id}{group ? `-${group}` : "" }" class="memberCard" on:click = {expandTray}>
            <!-- Horizontal container -->
            <span class="memberHeader">
                {#if member.avatar_url}
                    <img src={member.avatar_url} alt="" height="64px" style="border-radius: 9999px;">
                {/if}
                <!-- Vertical container -->
                <div>
                    <!-- Horizontal container -->
                    <span>
                        <h2 class="name">{member.name}</h2>
                        <p>|</p>
                        <p>{member.display_name ?? "No display name set"}</p>
                    </span>
                    <!-- Horizontal container -->
                    <span>
                        <small>{member.id}</small>
                        <p>|</p>
                        <small>{member.pronouns ?? "No pronouns set"}</small>
                    </span>
                </div>
                {#if needAuth}
                    <button on:click={() => {edit = true}}>
                        Edit
                    </button>
                {/if}
            </span>
        </div>
        <div class="tray hidden" id="{member.id}{group ? `-${group}` : "" }-tray">
            <div style="margin-bottom: 1rem;">
                {#if member.banner}
                    <img class="banner" src={member.banner} alt="">
                {/if}
                <p>Registered: <code>{dateFormat(member.created, "dddd, mmmm dS, yyyy")}</code> at <code>{dateFormat(member.created, "h:MM:ss TT")}</code></p>
                <p>Name: {member.name ?? "N/A"}</p>
                <p>Display name: {member.display_name ?? "N/A"}</p>
                <p>Birthday: {member.birthday ? readableDOB(member.birthday) : "N/A"}</p>
                <p>Pronouns: {member.pronouns ?? "N/A"}</p>
                <span><p>Color: {member.color ?? "N/A"}</p> <span id='swatch' style="background-color: #{member.color};"></span></span>
            </div>
            <span class="detail">
                <div>
                    Description:
                    <p>{member.description ?? "No description set."}</p>
                </div>
                <div>
                    <p>Proxies:</p>
                    {#each member.proxy_tags as proxy}
                        <p>{proxy.prefix ?? ""} text {proxy.suffix ?? ""}</p>
                    {/each}
                </div>
                {#if needAuth}
                    <Privacy edit={edit} mem={mem}/>
                {/if}
            </span>
        </div>
    
    {:else}
    
        <div id={member.id} class="memberCard">
            <!-- Horizontal container -->
            <span class="memberHeader">
                <img src={mem.avatar_url} alt="" height="64px" style="border-radius: 9999px; display: {member.avatar_url == null ? 'none' : 'unset'};">
                <!-- Vertical container -->
                <div>
                    <!-- Horizontal container -->
                    <span>
                        <h2>{member.name}</h2>
                        <p>|</p>
                        <p>{member.display_name ?? "No display name set"}</p>
                    </span>
                    <!-- Horizontal container -->
                    <span>
                        <small>{member.id}</small>
                        <p>|</p>
                        <small>{member.pronouns ?? "No pronouns set"}</small>
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
        <div class="tray" id="{member.id}-tray">
            <div style="margin-bottom: 1rem;">
                <p class="err">{err ?? ""}</p>
                <p class="load">{loading ? loadMsg : ""}</p>
                <span> <p>Name: </p> <input type="text" name="name" id="name" placeholder={member.name ?? "Name"} bind:value={mem.name}> </span>
                <span> <p>Display Name: </p> <input type="text" name="tag" id="tag" placeholder={member.display_name ?? "Display name"} bind:value={mem.display_name}> </span>
                <span> <p>Birthday: </p> <input type="text" name="dob" id="dob" placeholder={member.birthday ?? "Birthday (yyyy-mm-dd or mm-dd)"} bind:value={mem.birthday}> </span>
                <span> <p>Pronouns: </p> <input type="text" name="prns" id="prns" placeholder={member.pronouns ?? "Pronouns"} bind:value={mem.pronouns}> </span>
                <span> <p>Color: </p> <input type="text" name="color" id="color" placeholder={member.color ?? "Color"} bind:value={mem.color}> </span>
                <span id='swatch-edit' style="background-color: #{mem.color};"></span>
                <span> <p>Avatar URL: </p> <input type="text" name="pfp" id="pfp" placeholder={member.avatar_url ?? "Avatar URL"} bind:value={mem.avatar_url}> </span>
                <img src={mem.avatar_url} alt="" height="64px">
                <span> <p>Banner URL: </p> <input type="text" name="banner" id="banner" placeholder={member.banner ?? "Banner URL"} bind:value={mem.banner}> </span>
                {#if mem.banner}
                    <img class="banner" src={mem.banner} alt="">
                {/if}
            </div>
            <span class="detail">
                <div>
                    <p style="margin-top: 1rem;">Description:</p>
                    <textarea name="desc" id="desc" bind:value={mem.description}/>
                </div>
                <div>
                    <p>Proxies:</p>
                    {#each mem.proxy_tags as proxy, index}
                        <span class="proxy-tag" id={`proxy-${index}`}>
                            <input type="text"  name="prefix" id="pre" placeholder="Prefix" bind:value={proxy.prefix}>
                            <p>text</p>
                            <input type="text" name="suffix" id="suf" placeholder="Suffix" bind:value={proxy.suffix}>
                            <button on:click={() => {mem.proxy_tags = deleteProxy(index, mem)}}>✖</button>
                        </span>
                    {/each}
                    <button on:click={() => {mem.proxy_tags = addProxy(mem)}}>New</button>

                </div>
                <Privacy edit={edit} mem={mem}/>
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
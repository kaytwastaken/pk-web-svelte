<script lang="ts">
    export let member:Member
    export let needAuth:boolean
    
    import dateFormat from 'dateformat'
    import { onMount } from 'svelte';
    // Mine :)
    import type { Member, WriteMember } from '$lib/types'
    import Privacy from './MemberPrivacy.svelte'
    import pk from '$lib/pk';
    import { readable, validate as validateDOB } from '$lib/birthday'

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

    function expandTray () {
        if ( !edit ) {
            document.getElementById(`${member.id}-tray`).classList.toggle('hidden')
        }
    }

    // Validate member data before sending API call
    function validate () {
        // Validate DOB w function from $lib/birthday.ts
        if ( mem.birthday ) {
            try {
                validateDOB(mem.birthday)
            } catch (error) {
                err = error
                loading = false
                loadMsg = null
                throw err
            }
        }
        if ( mem.color ) {
            // Check against a valid 6-character hex regex
            if ( !/^(#|)[A-Fa-f0-9]{6}$/.test(mem.color) ) {
                // ✨ regexes :D
                err = new Error("Please enter a valid hex color code")
                loadMsg = null
                loading = false
                throw err
            }
            // Return without the # if neccessary
            if ( mem.color.slice(0,1) == '#' ) {
                mem.color = mem.color.slice(1,7)
            }

        }
        for ( let prop in mem.privacy ) {
            mem.privacy[prop] = mem.privacy[prop] ? 'public' : 'private'
            console.log(mem.privacy[prop])
        }
    }

    async function toggleEdit (cancel = false) {
        err = undefined
        // If not currently editing, set to edit mode
        if (!edit) {
            edit = true
        // If cancel=true is passed, set edit to false
        } else {
            // If cancel=false validate and send
            if (!cancel) {
                loading = true
                
                // Validate member data
                try {
                    loadMsg = 'Checking member data...'
                    validate()
                } catch (error) {
                    err = error
                    loadMsg = null
                    loading = false
                    return
                }
                
                // Save information to PK with a patch request
                loadMsg = '(1/2) Saving data...'
                await pk().members(member.id).patch({data: mem, token: token})
                // Reassign member to the response from a new API call to update information
                loadMsg = '(2/2) Refreshing data...'
                member = await pk().members(member.id).get({ token })
                
                // Exit edit mode
                edit = false
                loading = false
                loadMsg = null
                return
            }
            // If cancel = true exit edit mode
            edit = false
        }
    }

    function deleteProxy (index) {
        // Delete the specified proxy object and update the objects
        mem.proxy_tags.splice(index, 1)
        mem.proxy_tags = mem.proxy_tags
    }

    function addProxy () {
        // Create a blank proxy object and update the objects
        mem.proxy_tags.push({prefix: '', suffix: ''})
        mem.proxy_tags = mem.proxy_tags
    }
    
</script>

<!-- Return a div to be used in {#each} block on the profile page -->
<div class="cardHolder" style="border-bottom: {mem.color ? `3px solid #${mem.color}` : 'none'};">
    {#if !edit}
        <div id={member.id} class="memberCard" on:click = {expandTray}>
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
                    <button on:click={() => {toggleEdit()}}>
                        Edit
                    </button>
                {/if}
            </span>
        </div>
        <div class="tray hidden" id="{member.id}-tray">
            <div style="margin-bottom: 1rem;">
                {#if member.banner}
                    <img class="banner" src={member.banner} alt="">
                {/if}
                <p>Registered: <code>{dateFormat(member.created, "dddd, mmmm dS, yyyy")}</code> at <code>{dateFormat(member.created, "h:MM:ss TT")}</code></p>
                <p>Name: {member.name ?? "N/A"}</p>
                <p>Display name: {member.display_name ?? "N/A"}</p>
                <p>Birthday: {member.birthday ? readable(member.birthday) : "N/A"}</p>
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
    
        <div id={member.id} class="memberCard" on:click = {expandTray}>
            <!-- Horizontal container -->
            <span class="memberHeader">
                <img src={mem.avatar_url} alt="" height="64px" style="border-radius: 9999px;">
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
                    <button id="save" on:click={() => {toggleEdit()}}>
                        Save
                    </button>
                    <button id="cancel" on:click={() => {toggleEdit(true)}}>
                        Cancel
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
                            <button on:click={() => {deleteProxy(index)}}>✖</button>
                        </span>
                    {/each}
                    <button on:click={addProxy}>New</button>

                </div>
                {#if needAuth}
                    <Privacy edit={edit} mem={mem}/>
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
            @include sm-screen {
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
    

    .container {
        align-items: center;
    }
    .hr {
        width: 70vw;
        @include descending-width;
        border-bottom: 3px solid $gray;
        margin: 1rem 0 2rem 0;
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
            * {
                margin-right: .5rem;
            }
        }
        
        .tray > span {
            align-items: flex-start;
        }
    }
    .memberHeader {
        @include xs-screen {
            flex-direction: column;
            align-items: flex-start !important;
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
        @include xs-screen {
            position: relative;
            top: 3rem;
        }
    }
    #save:hover {
        background-color: $green-2;
    }
    #cancel {
        background-color: $red;
        @include xs-screen {
            position: relative;
            top: -2.6rem;
        }
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
        // @include sm-screen {
        //     width: 15rem;
        // }
        @include xs-screen {
            width: 100%;
        }
    }
    .memberCard:hover {
        background-color: $gray-2;
    }
</style>
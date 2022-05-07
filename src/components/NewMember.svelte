<script lang=ts>
    import { memberList } from '$lib/stores'
    import { onMount } from 'svelte';
    // Mine :)
    import type { WriteMember } from '$lib/types'
    import Privacy from './MemberPrivacy.svelte'
    import { validateMember } from '$lib/validate'
    import pk from '$lib/pk'
    import { addProxy, deleteProxy } from '$lib/members'

    let token
    let edit = false
    let err
    let loading = false
    let loadMsg
    let memList
    
    onMount(() => {
        token = localStorage.getItem('token')
    })

    memberList.subscribe(value => {
        memList = value
    })

    let mem:WriteMember
    function clearMem () {
        mem = {
            name: '',
            display_name: '',
            color: '',
            birthday: '',
            pronouns: '',
            avatar_url: '',
            banner: '',
            description: '',
            proxy_tags: [],
            privacy: {
                visibility: 'public',
                name_privacy: 'public',
                description_privacy: 'public',
                bithday_privacy: 'public',
                pronoun_privacy: 'public',
                avatar_privacy: 'public',
                metadata_privacy: 'public'
            },
        }
    }
    clearMem()

    function cancel () {
        err = null
        loading = false
        loadMsg = null
        clearMem()
    }

    async function saveData () {
        // Do stuff
        // Save information to PK with a patch request
        loading = true
        loadMsg = '(1/2) Saving data...'
        try {
            validateMember(mem)
            console.log("data validated")
        } catch (error) {
            console.log("error caught" + error)
            loadMsg = null
            edit = false
            return
        }
        // Add the response object to the member list (which should hopefully rerender the list?? fingers crossed)
        
        loadMsg = '(2/2) Refreshing data...'
        // Post req to API and add response to memList
        memList.push(await pk().members().post({data: mem, token: token}))
        
        // Update store with new memList
        memberList.set(memList)
        
        // Exit edit mode
        clearMem()
        loading = false
        loadMsg = null
        edit = false
    }

</script>

<div class="cardHolder">
    <div class="memberCard">
        <span class="memberHeader">
            Add member
            {#if !edit}
                <span class="buttons">
                    <button on:click={() => {edit = true}}>
                        New Member
                    </button>
                    <!-- <button disabled={true}>
                        New Group
                    </button> -->
                </span>
            {:else}
                <span class="buttons">
                    <button id="save" on:click={() => {saveData()}} disabled={mem.name != '' ? false : true}>
                        Save
                    </button>
                    <button id="cancel" on:click={() => {cancel()}}>
                        Cancel
                    </button>
                </span>
            {/if}
        </span>
    </div>
    {#if edit}
        <div class="tray">
            <div style="margin-bottom: 1rem;">
                <p class="err">{err ?? ""}</p>
                <p class="load">{loading ? loadMsg : ""}</p>
                <span> <p>Name: <req style="color:red; font-size:larger;">*</req></p> <input type="text" name="name" id="name" placeholder="Required" bind:value={mem.name}> </span>
                <span> <p>Display Name: </p> <input type="text" name="tag" id="tag" placeholder={mem.display_name ?? "Display name"} bind:value={mem.display_name}> </span>
                <span> <p>Birthday: </p> <input type="text" name="dob" id="dob" placeholder={mem.birthday ?? "Birthday (yyyy-mm-dd or mm-dd)"} bind:value={mem.birthday}> </span>
                <span> <p>Pronouns: </p> <input type="text" name="prns" id="prns" placeholder={mem.pronouns ?? "Pronouns"} bind:value={mem.pronouns}> </span>
                <span> <p>Color: </p> <input type="text" name="color" id="color" placeholder={mem.color ?? "Color"} bind:value={mem.color}> </span>
                <span id='swatch-edit' style="background-color: #{mem.color};"></span>
                <span> <p>Avatar URL: </p> <input type="text" name="pfp" id="pfp" placeholder={mem.avatar_url ?? "Avatar URL"} bind:value={mem.avatar_url}> </span>
                <img src={mem.avatar_url} alt="" height="64px">
                <span> <p>Banner URL: </p> <input type="text" name="banner" id="banner" placeholder={mem.banner ?? "Banner URL"} bind:value={mem.banner}> </span>
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

<style lang=scss>
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
    button:disabled {
        background: none;
        border: 1px solid $blue;
        color: $blue;
        opacity: .7
    }
    button:disabled:hover {
        cursor: default;
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
    #save:disabled {
        background: none;
        border-color: $green;
        color: $green;
    }
    #save:disabled:hover {
        cursor: normal;
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
</style>
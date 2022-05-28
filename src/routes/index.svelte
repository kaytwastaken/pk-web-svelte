<script lang="ts">
    import { loggedIn, currentUser } from '$lib/stores'
    import { login, logout } from '$lib/user';
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    
    // Content-binded variables
    let token = ''
    let id = ''
    // let value = token
    let edit = true
    let loading = false
    let err = null

    // Elements
    let editButton
    let publicButton

    let isLoggedIn:boolean
    let user;

    // Subcribe to the loggedIn and currentUser stores
    loggedIn.subscribe(value => {
        isLoggedIn = value
    })
    currentUser.subscribe(value => {
        user = value
    })

    onMount(() => { 
        // If token is already stored, use it to log in
        if (localStorage.getItem("token")) {
            login(localStorage.getItem("token"));
        }

        // Assign elements to alias variables
        editButton = document.getElementById('editButton')
        publicButton = document.getElementById('publicButton')
    })

    // Define handler for login imported from user
    async function logUserIn () {
        loading = true
        await login(token)
        token = ''
        loading = false
    }

    function gotoPublic () {
        goto(`/profile/${token}`)
    }

    function setEdit (val) {
        // State var
        edit = val

        // Buttons
        editButton.disabled = val ? true : false
        editButton.ariaDisabled = val ? 'true' : 'false'
        publicButton.disabled = val ? false : true
        publicButton.ariaDisabled = val ? 'false' : 'true'
    }

</script>

<svelte:head>
    <title>pk-web | kayt.dev</title>
</svelte:head>

<div class="container">
    <div class="card">
        <!-- If the loading state is true, return loading state header -->
        {#if loading}
            <h1>Logging in . . .</h1>
            <hr>
        
        <!-- If a user is currently logged in display their information -->
        {:else if isLoggedIn}
            {#if user && user.name}
                <h1 class="loggedIn">Logged in as <code>{user.name}</code></h1>
            {:else}
                <h1>Welcome!</h1>
            {/if}
            <button class="loggedIn" on:click={() => {goto('/profile')}}>Profile</button>
            <button class="loggedIn" on:click={logout}>Logout</button>

        <!-- If no user is saved, show the log in -->
        {:else}
            <h1>PluralKit web interface :D</h1>
            <p>Made by Kayt_was_taken! | <a href="https://github.com/Kaytwastaken">GitHub</a></p>
            
            <div class="switches">
                <button id="editButton" disabled={true} aria-disabled="true" on:click={() => {setEdit(true)}}>Edit your system</button>
                <button id="publicButton" on:click={() => {setEdit(false)}}>View public information</button>
            </div>
            <form id="loginForm" on:submit|preventDefault={edit ? logUserIn : gotoPublic}>
                <input id="formInput" type="text" name="input" placeholder={edit ? "pk;token" : "xxxxx"} bind:value={token}>
                <label for="input">{edit ? "Enter your PluralKit token here. Use pk;token to get it." : "Enter a 5-letter system ID or 18-character Discord User ID"}</label>
                <!-- If err state is saved, expose error to user -->
                {#if err}
                    <p class="err">{err.code == '401' ? 'Invalid token.' + token : err.message}</p>
                {/if}
                <input
                    disabled={edit ? (token.length != 64 ? true : false) : (token.length == 5 || token.length == 18 ? false : true)}
                    type="submit"
                    class="submit"
                    value="Submit"
                >
            </form>
        {/if}
    </div>
</div>


<style lang='scss'>
    .container {
        height: calc(100vh - 5rem - 3rem);
    }
    .card {
        display: flex;
        flex-direction: column;
        width: 40%;
        @include lg-screen {
            width: 50%
        }
        @include md-screen {
            width: 60%;
        }
        @include sm-screen {
            width: 70%;
        }
        @include xs-screen {
            width: 80%;
        }
    }
    a {
        width: min-content;
    }
    button {
        margin: .6rem;
        border: none;
        background: $blue;
        padding: .6rem;
        border: none;
        border-radius: 5px;
        font-weight: bold;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        font-size: medium;
    }
    button.loggedIn {
        width: 100%;
        // width: 50%;
        margin: 1rem auto 0 auto;
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
    button:hover {
        cursor: pointer;
        background: $blue-secondary;
    }
    .switches {
        margin-top: 1rem;
        width: fit-content;
        background: $gray;
        border-radius: 7px 7px 0 0;
        :first-child {
            margin-right: 0;
        }
        
    }
    h1 {
        margin-bottom: 0 !important;
    }
    .err {
        color: $red;
    }
    input[type=text] {
        border-radius: 0 5px 5px 5px;
    }
</style>
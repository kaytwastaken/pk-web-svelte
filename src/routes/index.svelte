<script lang="ts">
    import { loggedIn, currentUser } from '../stores';
    import pk from '$lib/pk';
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    
    // Content-binded variables
    let token = ''
    let loading = false
    let err = null

    let isLoggedIn:boolean
    let user;


    // Subcribe to the loggedIn and currentUser stores
    loggedIn.subscribe(value => {
        isLoggedIn = value
    })
    currentUser.subscribe(value => {
        user = value
    })

    // If token is already stored, use it to log in
    onMount(() => { 
        if (localStorage.getItem("token")) {
            login(localStorage.getItem("token"));
        }
    })

    async function login(token) {
        // Set loading state to true
        loading = true
        
        // Try logging in using the token in memory and storing it in localStorage
        try {
            localStorage.setItem('token', token)
            const res = await pk().systems('@me').get({ token })
            // Save currently logged in user to Svelte stores
            loggedIn.update(() => true)
            currentUser.update(() => res)
            // console.error(user)
    
        // If the login fails tell the user and log it.
        } catch (error) {
            err = error
            console.log(error.message)
            // Nuke the token and stores
            localStorage.removeItem('token')
            loggedIn.update(() => false)
            currentUser.update(() => null)
        }

        // Set loading state to false after a failed or succesful login
        loading = false
    }

    function logout() {
        // Nuke the token and stores when a user logs out
        token = '';
        localStorage.removeItem("token");
        // Clear the stores
        loggedIn.update(() => false);
        currentUser.update(() => null);
    }
</script>

<div class="container">
    <div class="card">
        <!-- If the loading state is true, return loading state header -->
        {#if loading}
            <h1>Logging in . . .</h1>
            <hr>
        
        <!-- If a user is currently logged in display their information -->
        {:else if isLoggedIn}
            {#if user && user.name}
                <h1>Logged in as <code>{user.name}</code></h1>
            {:else}
                <h1>Welcome!</h1>
            {/if}
            <button class="loggedIn" on:click={() => {goto('/profile')}}>Profile</button>
            <button class="loggedIn" on:click={logout}>Logout</button>

        <!-- If no user is saved, show the log in -->
        {:else}
            <h1>PluralKit web interface :D</h1>
            <p>Made by Kayt_was_taken! | <a href="https://github.com.kaytwastaken">GitHub</a> | <a href="https://kayt.dev">Personal site</a></p>
            
            <div class="switches">
                <button aria-disabled="false">Edit your system</button>
                <button disabled aria-disabled="true">View public information</button>
            </div>
            <form on:submit|preventDefault={() => {login(token)}}>
                <input type="text" name="input" placeholder="pk;token" bind:value={token}>
                <label for="input">Enter your PluralKit token here. Use pk;token to get it.</label>
                <!-- If err state is saved, expose error to user -->
                {#if err}
                    <p class="err">{err.code == '401' ? 'Invalid token.' + token : err.message}</p>
                {/if}
                <input disabled={token.length < 64 ? true : false} type="submit" class="submit">
            </form>
        {/if}
    </div>
</div>


<style lang='scss'>
    .container {
        height: 90vh;
        justify-content: center;
        align-items: center;
    }
    .card {
        display: flex;
        flex-direction: column;
        width: 40%;
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
        margin: 1rem 0 0 0;
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
        :last-child {
            margin-left: 0;
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
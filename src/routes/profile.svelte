<script lang="ts">
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation'

    let token
    // Get token from localStorage
    onMount(async () => {
        token = localStorage.getItem('token')
        if (token == undefined ) goto('/')
    })
    

    import Profile from '../components/Profile.svelte'


</script>

<!-- While token is undefined display loading header -->
{#if token == undefined}
    <div class="container"><h1>Logging in...</h1></div>
{:else}
    <!-- Display profile content -->
    <Profile id='@me' token={token}></Profile>
{/if}

<style lang="scss">
    .container {
        align-items: center;
    }
</style>
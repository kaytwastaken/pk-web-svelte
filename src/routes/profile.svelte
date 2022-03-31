<script lang="ts">
    import { onMount } from 'svelte';

    let token
    onMount(() => {token = localStorage.getItem('token')})
    
    import Profile from '../components/Profile.svelte'


</script>

{#if token == undefined}
    <div class="container"><h1>Logging in...</h1></div>
{:else}
    <Profile id='@me' token={token}></Profile>
{/if}

<style lang="scss">
    .container {
        align-items: center;
    }
</style>
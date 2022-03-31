<script lang="ts">
import pk from '../lib/pk'

const token = 'xdosjkvQOKGULJFay7p22H7ONsUBCezuRnZS9vj2ubhebRuwCif4fSqpDVscjF4N'
let sys
let members

async function doTheFetch() {
    sys = await pk().systems('606866973120397483').get({ token })
    members = await pk().systems('606866973120397483').members.get({ token })
}
</script>

<form on:submit|preventDefault={doTheFetch}>
    <input type="submit" class="submit">
</form>
{#if sys === undefined || members === undefined}
<!-- {#if sys === undefined} -->
    <h1>Loading . . .</h1>  
{:else}
    <h1>{sys.name}</h1>
    <p>{members.length} members</p>
    {#each members as member}
        <h2>{member.name}</h2>
    {/each}
{/if}
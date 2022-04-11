<script lang="ts">
    import type { System, Member } from '../lib/types'
    export let system:System
    export let members:Array<Member>

    import dateFormat from 'dateformat'

    function expandTray () {
        document.getElementById(`${system.id}-tray`).classList.toggle('hidden')
    }
</script>

<!-- Return a div to contain passed system information -->
<div class="cardHolder" style="border-bottom: {system.color ? `3px solid #${system.color}` : 'none'};">
    <div class="system" on:click={expandTray}>
        <!-- Horizontal contianer -->
        <span>
            <img src={system.avatar_url} alt="" height="64px" style="border-radius: 9999px;">
            <!-- Vertical container -->
            <div>
                <!-- Horizontal container -->
                <span>
                    <h1>{system.name}</h1>
                    <p>{system.tag ?? "No tag set"}</p>
                </span>
                <!-- Horizontal container -->
                <span>
                    <small>{system.id}</small>
                    <p>|</p>
                    <small>{system.pronouns ?? "No pronouns set"}</small>
                </span>
            </div>
        </span>
    </div>
    <div class="tray hidden" id="{system.id}-tray">
        <div style="margin-bottom: 1rem;">
            {#if system.banner}
                <img src={system.banner} alt="">
            {/if}
            <p>Registered: <code>{dateFormat(system.created, "dddd, mmmm dS, yyyy")}</code> at <code>{dateFormat(system.created, "h:MM:ss TT")}</code></p>
            <p>Pronouns: {system.pronouns ?? "N/A"}</p>
            <p>Tag: {system.tag ?? "N/A"}</p>
            <p>Color: {system.color ?? "N/A"}</p>
            {#if members}
                <p>Members: {members.length}</p>
            {/if}
        </div>
        <span>
            <p>
                {system.description ?? "No description set"}
            </p>
        </span>
    </div>
</div>


<style lang="scss">
    .hidden {
        display: none;
    }
    .tray {
        padding: 1rem;
        border-radius: .5rem;
        p {
            width: 50%;
        }
        img {
            width: 50%;
            border-radius: .5rem;
        }
    }
    
    .container {
        align-items: center;
    }
    .cardHolder {
        border-radius: .5rem;
        background: $gray;
        margin-bottom: 1rem;
    }
    .system {
        width: 70vw;
        background: $gray;
        padding: 1rem;
        border-radius: .5rem;
        h1, h2, h3 {
            margin: 0;
        }
        span {
            display: flex;
            flex-direction: row;
            align-items: center;
            * {
                margin-right: .5rem;
            }
        }
    }
    .system:hover {
        background: $gray-2;
    }
</style>
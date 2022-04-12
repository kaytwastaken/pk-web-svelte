<script lang="ts">
    export let member
    export let auth:boolean
    import dateFormat from 'dateformat'

    import Privacy from './Privacy.svelte'

    function expandTray () {
        document.getElementById(`${member.id}-tray`).classList.toggle('hidden')
    }
</script>

<!-- Return a div to be used in {#each} block on the profile page -->
<div class="cardHolder" style="border-bottom: {member.color ? `3px solid #${member.color}` : 'none'};">
    <div id={member.id} class="memberCard" on:click = {expandTray}>
        <!-- Horizontal container -->
        <span class="tray-button">
            <img src={member.avatar_url} alt="" height="64px" style="border-radius: 9999px;">
            <!-- Vertical container -->
            <div>
                <!-- Horizontal container -->
                <span>
                    <h2>{member.name}</h2>
                    <vr>|</vr>
                    <p>{member.display_name ?? "No display name set"}</p>
                </span>
                <!-- Horizontal container -->
                <span>
                    <small>{member.id}</small>
                    <vr>|</vr>
                    <small>{member.pronouns ?? "No pronouns set"}</small>
                </span>
            </div>
        </span>
    </div>
    <div class="tray hidden" id="{member.id}-tray">
        <div style="margin-bottom: 1rem;">
            {#if member.banner}
                <img src={member.banner} alt="">
            {/if}
            <p>Registered: <code>{dateFormat(member.created, "dddd, mmmm dS, yyyy")}</code> at <code>{dateFormat(member.created, "h:MM:ss TT")}</code></p>
            <p>Pronouns: {member.pronouns ?? "N/A"}</p>
            <p>Display name: {member.display_name ?? "N/A"}</p>
            <p>Birthday: {member.birthday ?? "N/A"}</p>
            <p>Color: {member.color ?? "N/A"}</p>
        </div>
        <span class="detail">
            <div>
                Description:
                <p>
                    {member.description ?? "No description set"}
                </p>
            </div>
            <div>
                <p>Proxies:</p>
                {#each member.proxy_tags as proxy}
                    <p>{proxy.prefix ?? ""} text {proxy.suffix ?? ""}</p>
                {/each}
            </div>
            {#if auth}
                <Privacy member={member}/>
            {/if}
        </span>
    </div>
</div>


<style lang="scss">
    .hidden {
        display: none;
        margin-top: 0;
    }
    .tray {
        padding: 1rem;
        border-radius: .5rem;
        img {
            width: 50%;
            border-radius: .5rem;
        }
        div {
            margin-right: 2rem;
        }
        .detail {
            display: flex;
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
    .memberCard:hover {
        background-color: $gray-2;
    }
</style>
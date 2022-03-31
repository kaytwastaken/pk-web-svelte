<script lang="ts">
    export let member
</script>

<div class="memberCard" style="border-bottom: {member.color ? `3px solid #${member.color}` : 'none'};">
    <span>
        <img src={member.avatar_url} alt="" height="64px" style="border-radius: 9999px;">
        <div>
            <span>
                <h2>{member.name}</h2>
                <p>{member.display_name ? `(${member.display_name})` : "No display name set"}</p>
            </span>
            <small>{member.id}</small>
        </div>
    </span>
</div>

<style lang="scss">
    .container {
        align-items: center;
    }
    .hr {
        width: 70vw;
        border-bottom: 3px solid $gray;
        margin: 1rem 0 2rem 0;
    }
    .memberCard {
        width: 70vw;
        background: $gray;
        padding: 1rem;
        margin-bottom: 1rem;
        // border-radius: .5rem .5rem 0 0;
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
</style>
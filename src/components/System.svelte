<script lang="ts">
    export let system
</script>

<!-- Return a div to contain passed system information -->
<div class="system" style="border-bottom: {system.color ? `3px solid #${system.color}` : 'none'};">
    <!-- Horizontal contianer -->
    <span>
        <img src={system.avatar_url} alt="" height="64px" style="border-radius: 9999px;">
        <!-- Vertical container -->
        <div>
            <!-- Horizontal container -->
            <span>
                <h1>{system.name}</h1>
                <p>{system.tag ? `(${system.tag})` : "No tag set"}</p>
            </span>
            <small>{system.id}</small>
        </div>
    </span>
</div>



<style lang="scss">
    .container {
        align-items: center;
    }
    .system {
        width: 70vw;
        background: $gray;
        padding: 1rem;
        margin: 1rem 0 1rem 0;
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
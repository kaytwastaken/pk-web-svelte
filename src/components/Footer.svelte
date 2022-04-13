<script lang=ts>
    function expandTodo () {
        document.getElementById(`todo`).classList.toggle('hidden')
    }
</script>

<footer>
    <!-- <div id="todo" class="hidden">
        <h3>Todo for v0.1.0</h3>
        <li>Add/delete members</li>
        <li>Editing proxies</li>
        <li>Editing privacy</li>
    </div> -->
    <span>
        <a href="https://kayt.dev" class="external">kayt.dev</a>
        <p on:click={expandTodo}>v0.1.0-beta</p>
        <!-- id="todoLink" -->
    </span>
</footer>

<style lang='scss'>
$header-space: 4rem;
    
    footer {
        position: relative;
        bottom: 0;
        height: 3rem;
        @include xsh-screen {
            display: none;
        }
        padding: 0 calc($header-space / 2) 0 calc($header-space / 2);
        display: flex;
        flex-direction: row;
        align-items: center;
    }
    a, p {
        text-decoration: none;
        margin-right: 2rem;
        color: $text;
    }
    a:hover, #todoLink:hover {
        padding-bottom: 4px;
        border-bottom: 2px $blue solid;
    }
    a.external:hover{
        border-bottom-color: $orange;
    }

    em {
        color: $orange
    }
    span {
        height: 3rem;
        display: flex;
        flex-direction: row;
        align-items: center;
    }
    span :last-child {
        margin-right: 0 !important;
    }
    #todo {
        width: 15rem;
        height: fit-content;
        position: absolute;
        bottom: 0;
        padding-bottom: 3rem;
        z-index: -1;
        left: 0;
        background-color: $gray;
        :first-child {
            margin-top: 1rem;
        }
        * {
            margin-left: 1rem;
        }
        border-top-right-radius: .5rem;
    }
    .hidden {
        display: none;
    }
</style>
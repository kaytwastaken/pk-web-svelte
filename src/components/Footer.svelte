<footer>
    <span>
        <a href="/profile" class="external">kayt.dev</a>
        <p>v0.1.0-beta</p>
    </span>
</footer>

<style lang='scss'>
$header-space: 4rem;
    
    footer {
        position: absolute;
        bottom: 0;
        height: 3rem;
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
    a:hover {
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
</style>
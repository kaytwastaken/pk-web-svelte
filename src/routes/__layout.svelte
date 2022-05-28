<script>
    import Header from '../components/Header.svelte'
    import Footer from '../components/Footer.svelte'

    import NProgress from 'nprogress'
    import { navigating } from '$app/stores'

    // NProgress CSS
    import '../style/nprogress.scss'

    NProgress.configure({
        minimum: 0.1,
    })

    $: {
        if ($navigating) {
            NProgress.start()
        }
        if (!$navigating) {
            NProgress.done()
        }
    }
</script>

<Header></Header>
<slot></slot>
<Footer></Footer>
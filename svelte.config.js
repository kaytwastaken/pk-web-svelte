// import adapter from '@sveltejs/adapter-auto';
import adapter from '@sveltejs/adapter-node';
import preprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: preprocess({
		scss: {
			prependData: `@import './src/style/app.scss';`
		} 
	}),
	onwarn: (warning, handler) => {
        const { code } = warning;
        if (code === "css-unused-selector")
            return;

        handler(warning);
    },

	kit: {
		adapter: adapter({
			out: 'build',
			envPrefix: 'PROD_'
		})
	}
};

export default config;

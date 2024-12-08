import { defineConfig, loadEnv } from 'vite'
import mkcert from 'vite-plugin-mkcert'
// import { svelteSVG } from "rollup-plugin-svelte-svg";

// import pkg from './package.json';

// export default defineConfig(({ command, mode }) => {
	// Load env file based on `mode` in the current working directory.
	// Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
	// const env = loadEnv(mode, process.cwd(), '')
	// return {
	  // vite config
// 	  define: {
// 		__APP_ENV__: JSON.stringify(env.APP_ENV),
// 	  },
// 	}
//   })
  
// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		mkcert(),
		// svelte(),
		// svelteSVG({
            // optional SVGO options
            // pass empty object to enable defaults
            // svgo: {}
        // }),

	],
	build: {
		// rollupOptions: {
		// 	input: {
		// 	//   main: resolve(__dirname, 'index.html'),
		// 	// bridesp: 'src/examples/bridesp/index.html'
		// 	bridesp: 'src/examples/index.html'
		// }
		// },
	  
		// manifest: true,
		// // ssr: 'true',		// Серверный рендеринг
		// // ssrManifest: true,
		// emptyOutDir: false,
		// outDir: './out',
		// assetsDir: 'js',
		// //cssTarget: 'css',
		// minify: false
	},
 	server: {
		host: '127.0.0.1',
		port: 8080,
		https: true,
		open: true,
	},
	// base: '../',
	// root: 'src/examples/bridesp/'
	// root: 'src/examples/'
})

import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';

export default {
	input: 'test/test.js',
	output: {
		sourcemap: true,
		format: 'iife',
		name: 'app',
		file: `test/test-bundle.js`
	},
	plugins: [
		svelte(),
		resolve()
	]
};

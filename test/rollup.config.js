import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import livereload from "rollup-plugin-livereload";

export default {
  input: 'test/test-main.js',
  output: {
    sourcemap: true,
    format: 'iife',
    name: 'app',
    file: `test/test-bundle.js`
  },
  plugins: [
    svelte(),
    resolve(),
    livereload('test'),
  ]
};

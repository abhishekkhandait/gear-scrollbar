import typescript from '@rollup/plugin-typescript';
import resolve from 'rollup-plugin-node-resolve';
import {terser} from 'rollup-plugin-terser';
import filesize from 'rollup-plugin-filesize';

const isProduction = process.env.NODE_ENV === 'production';

export default {
  input: 'src/gearscroll.ts',
  output: [
    {
      format: 'esm',
      file: 'dist/gearscroll.esm.js'
    },
    {
      format: 'umd',
      file: 'dist/gearscroll.js',
      name: 'gearScroll',
      sourcemap: true
    },
    {
      format: 'iife',
      file: 'dist/gearscroll.min.js',
      name: 'gearScroll'
    }
  ],
  onwarn(warning) {
    if (warning.code !== 'THIS_IS_UNDEFINED') {
      console.error(`(!) ${warning.message}`);
    }
  },
  plugins: [
    typescript(),
    resolve(),
    filesize({
      showBrotliSize: true,
    }),
  ],
};

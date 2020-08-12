import typescript from '@rollup/plugin-typescript';
import resolve from 'rollup-plugin-node-resolve';
import {terser} from 'rollup-plugin-terser';
import filesize from 'rollup-plugin-filesize';

const isProduction = process.env.NODE_ENV === 'production';

export default {
  input: 'src/index.ts',
  output: {
    dir: 'output',
    format: 'esm',
  },
  onwarn(warning) {
    if (warning.code !== 'THIS_IS_UNDEFINED') {
      console.error(`(!) ${warning.message}`);
    }
  },
  plugins: [
    typescript(),
    resolve(),
    isProduction &&
      terser({
        module: true,
        warnings: true,
        mangle: {
          properties: {
            regex: /^__/,
          },
        },
        output: {comments: false},
      }),
    filesize({
      showBrotliSize: true,
    }),
  ],
};

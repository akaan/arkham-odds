import typescript from 'rollup-plugin-typescript2';
import pkg from './package.json';

let banner = `/**
 * ArkhamOdds v${pkg.version}
 * ${pkg.description}
 * Author: ${pkg.author}
 */`

export default {
  input: 'src/index.ts',
  output: {
    name: 'ArkhamOdds',
    file: 'dist/arkham-odds.js',
    format: 'iife',
    banner: banner
  },
  plugins: [
    typescript()
  ]
}

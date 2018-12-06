import typescript from 'rollup-plugin-typescript2';

export default {
  input: 'src/index.ts',
  output: {
    name: 'ArkhamOdds',
    file: 'dist/arkham-odds.js',
    format: 'iife'
  },
  plugins: [
    typescript()
  ]
}

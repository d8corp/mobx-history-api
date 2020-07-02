import typescript from 'rollup-plugin-typescript2'
import pkg from './package.json'

const def = {
  input: {
    index: 'src/index.ts',
    history: 'src/history.ts',
    scroll: 'src/scroll.ts',
    decode: 'src/decode.ts',
    setSearch: 'src/setSearch.ts',
    removeSearch: 'src/removeSearch.ts',
    parseUrl: 'src/parseUrl.ts',
  },
  external: [
    ...Object.keys(pkg.dependencies || {})
  ]
}

export default [{
  ...def,
  output: {
    dir: 'lib',
    entryFileNames: '[name]' + pkg.main.replace('index', ''),
    format: 'cjs'
  },
  plugins: [
    typescript({
      typescript: require('typescript'),
    })
  ]
}, {
  ...def,
  output: {
    dir: 'lib',
    entryFileNames: '[name]' + pkg.module.replace('index', ''),
    format: 'es'
  },
  plugins: [
    typescript({
      typescript: require('typescript'),
      tsconfigOverride: {
        compilerOptions: {
          target: 'es6'
        }
      }
    })
  ]
}]

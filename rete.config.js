import typescript from '@rollup/plugin-typescript';

export default {
    input: 'src/index.ts',
    name: 'DockPlugin',
    globals: {
        'rete': 'Rete'
    },
    babelPresets: [
        require('@babel/preset-typescript')
    ],
    plugins: [typescript()]
}
export default {
    input: 'src/index.ts',
    name: 'DockPlugin',
    globals: {
        'rete': 'Rete'
    },
    babelPresets: [
        require('@babel/preset-typescript')
    ],
    extensions: ['.js', '.ts']
}
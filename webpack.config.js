var webpack = require('webpack');

module.exports = {
    entry: {
        main: __dirname + '/src/ts/main.ts',
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    devtool: 'source-map',
    output: {
        path: __dirname + '/build/ts',
        filename: 'tsCompiled.js'
    },
    module: {
        loaders: [
            {
                test: /\.ts?$/,
                loaders: ['babel-loader', 'awesome-typescript-loader'],
                exclude: /node_modules/
            }
        ]
    },
    plugins: []
};
const { resolve } = require("path");
const Copy = require('copy-webpack-plugin');
const public = resolve(__dirname, "src/server/public");

module.exports = {
    mode: 'production',
    entry: {
        bundle: "./src/client/main.tsx"
    },
    devtool: "source-map",
    output: {
        filename: "bundle.js",
        path: public,
        publicPath: "/"
    },
    resolve: {
        extensions: ['.js', '.ts', '.tsx']
    },
    plugins: [
        new Copy([
            { from: resolve(__dirname, "assets") , to: public }
        ])
    ],
    module: {
        rules: [
            {
                test: [/\.tsx?$/],
                use: [
                    { loader: 'ts-loader', options: { transpileOnly: true } }
                ]
            },
            {
                test: /\.scss|css$/,
                use: [
                    {
                        loader: "style-loader"
                    },
                    {
                        loader: "css-loader"
                    },
                    {
                        loader: "sass-loader"
                    }
                ]
            },
            {
                test: /\.(jpg|png|pdf)$/,
                use: [
                    {
                        loader: 'file-loader'
                    }
                ]
            },
            {
                test: /\.(png|jpg|gif)$/i,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 8192
                        }
                    }
                ]
            }
        ]
    }
};
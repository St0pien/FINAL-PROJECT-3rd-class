const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { EnvironmentPlugin } = require('webpack');

module.exports = {
    entry: './src/main.js',
    output: {
        publicPath: "/game/",
        path: path.join(__dirname, '..', 'server', 'static', 'game'),
        filename: 'bundle.js'
    },
    mode: 'development',

    plugins: [
        new HtmlWebpackPlugin({
            hash: true,
            filename: '../../views/index.html',
            template: './src/public/index.html',
            minify: true,
            inject: 'head'
        }),

        new EnvironmentPlugin({
            API_URL: 'http://localhost:3000/'
        })
    ],

    module: {
        rules: [
            {
                test: /\.css/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.(png|jp(e*)g|svg|mp4|fbx)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 8000,
                            name: 'assets/[hash]-[name].[ext]'
                        }
                    }
                ]
            }
        ]
    },

    devServer: {
        port: 8080,
        watchOptions: {
            poll: 100
        }
    }
}
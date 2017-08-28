const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const port = process.env.PORT || 12345
const baseDir = path.join(__dirname, '../')

module.exports = {
    entry: [   
        'react-hot-loader/patch',
        'webpack-hot-middleware/client', 
        path.join(baseDir, "./src/render-process/index.tsx")
    ],
    output: {
        filename: "bundle.js",
        path: path.join(baseDir + "./dist"),
        publicPath: `http://localhost:${port}/`
    },

    // Enable sourcemaps for debugging webpack's output.
    devtool: "source-map",

    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: [".ts", ".tsx", ".js", ".json"]
    },

    module: {
        rules: [
            // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
            { 
                test: /\.tsx?$/, 
                loader: ['react-hot-loader/webpack','awesome-typescript-loader']
            },
            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            { 
                enforce: "pre", 
                test: /\.js$/, 
                loader: "source-map-loader" 
            },
            // Add SASS support  - compile all .global.scss files and pipe it to style.css
            {
                test: /\.scss$/,
                use: [
                {
                    loader: 'style-loader'
                },
                {
                    loader: 'css-loader',
                    options: {
                        sourceMap: true,
                    },
                },
                {
                    loader: 'sass-loader'
                }
                ]
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                use: {
                  loader: 'url-loader',
                  query: {
                    limit: 10000,
                    name: 'imgs/[name].[ext]'
                  }
                }
            },  
        ]
    },
    plugins: [
        new CopyWebpackPlugin([{
            from: path.join(baseDir, 'lib'),
            to: path.join(baseDir, 'lib')
        }]),
		new webpack.HotModuleReplacementPlugin(),
		new HtmlWebpackPlugin({
			inject: true,
			template: path.join(baseDir, './src/render-process/index.html')
		})
    ],
    // 这是为了给electron render进程环境提供一些插件
    target: 'electron-renderer'
}
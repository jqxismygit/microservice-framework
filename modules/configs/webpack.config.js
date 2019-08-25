const path = require('path')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const autoprefixer = require('autoprefixer')
const crypto = require('crypto')
const md5 = crypto.createHash('md5')
const {
	NODE_ENV,
	PUBLIC_PATH,
  	OUTPUT_PATH,
	PACKAGE_DIR,
	PACKAGE_VERSION,
	PACKAGE_NAME,
} = process.env
const isDev = process.env.NODE_ENV !== 'production'
const PACKAGE_HASH = md5.update(PACKAGE_NAME).digest('hex').substr(0, 4)

const webpackConfig = {
	devtool: isDev ? 'eval' : 'none',
	entry: path.resolve(PACKAGE_DIR, './src/index'),
	context: PACKAGE_DIR,
  target: 'web',
	output: {
		publicPath: PUBLIC_PATH,
		path: OUTPUT_PATH,
    pathinfo: !isDev,
		filename: 'pkg.bundle.js',
    library: `loadPackage('${PACKAGE_NAME}@${PACKAGE_VERSION}')`,
    libraryTarget: "jsonp"
	},
	externals: {
		'react': 'React',
		'react-dom': 'ReactDOM',
		'react-router-dom': 'ReactRouterDOM',
		'redux': 'Redux',
		'react-redux': 'ReactRedux',
		'prop-types': 'ReactPropTypes',
		'classnames': 'classNames',
		'moment': 'moment',
		'lodash': '_',
		'jquery:': 'jQuery',
		'qs': 'Qs',
		'urijs': 'URI',
		'normalizr': 'normalizr'
	},
	module: {
		rules: [{
				test: /\.(js|jsx)$/,
				loader: require.resolve('babel-loader'),
				options: {
					cacheDirectory: true,
					presets: [require.resolve('babel-preset-react-app')]
				},
			}, {
				exclude: [
					/\.html$/,
					/\.xml$/,
					/\.(js|jsx)$/,
					/\.s?css$/,
					/\.json$/,
					/\.(bmp|gif|jpe?|png)$/,
				],
				loader: require.resolve('file-loader'),
				options: {
					name: 'static/[name].[hash:8].[ext]',
				},
			},
			{
				test: /\.(bmp|gif|jpe?|png)$/,
				loader: require.resolve('url-loader'),
				options: {
					limit: 1000,
					name: 'static/[name].[hash:8].[ext]',
				},
			},
			{
				test: /\.scss$/,
				use: ExtractTextPlugin.extract({
					fallback: require.resolve('style-loader'),
					use: [
						{
							loader: require.resolve('css-loader'),
							options: {
								sourceMap: !!isDev,
								minimize: !isDev,
								modules: true,
								localIdentName: isDev ? `[local]--[hash:base64:5]-${PACKAGE_NAME}` : `[hash:base64:8]-${PACKAGE_HASH}`
							}
						},
						{
							loader: require.resolve('postcss-loader'),
							options: {
								sourceMap: !!isDev,
								ident: 'postcss',
								plugins: () => [
									autoprefixer({
										browsers: [
											'last 5 versions',
											'Firefox ESR',
											'not ie < 9',
										],
										flexbox: 'no-2009'
									})
								]
							}
						},
						{
							loader: "sass-loader",
							options: {
								sourceMap: !!isDev,
								data: `
	                $PUBLIC_PATH: '${PUBLIC_PATH}';
	                $NODE_ENV: '${NODE_ENV}';
	              `
							}
						}
					]
				})
			}
		]
	},
	plugins: [
		new webpack.DefinePlugin({
			'process.env': {
        NODE_ENV: JSON.stringify(NODE_ENV),
        PUBLIC_PATH: JSON.stringify(PUBLIC_PATH)
			}
		}),
		new CopyWebpackPlugin([{
			from: 'public/',
			to: 'static/'
		}], {}),
		new CopyWebpackPlugin([{
			from: 'private/',
			to: 'private/'
		}], {}),
		new ExtractTextPlugin({
			filename: 'pkg.bundle.css',
		}),
		new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
	]
}

// if (!isDev) {
// 	webpackConfig.plugins.push(new UglifyJsPlugin({
// 		uglifyOptions: {
// 			ecma: 8,
// 			compress: {
// 				warnings: false,
// 				comparisons: false,
// 			},
// 			mangle: {
// 				safari10: true,
// 			},
// 			output: {
// 				comments: false,
// 				ascii_only: true,
// 			},
// 		},
// 		parallel: true,
// 		cache: false,
// 		sourceMap: false,
// 	}))
// }

module.exports = webpackConfig

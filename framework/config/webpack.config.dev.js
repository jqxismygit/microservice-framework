'use strict';

const autoprefixer = require('autoprefixer');
const path = require('path');
const pkg = require('../package');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const InterpolateHtmlPlugin = require('./plugins/InterpolateHtmlPlugin');
const WatchMissingNodeModulesPlugin = require('react-dev-utils/WatchMissingNodeModulesPlugin');
const eslintFormatter = require('react-dev-utils/eslintFormatter');
const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin');
const getClientEnvironment = require('./env');
const paths = require('./paths');
const publicPath = '/';
const publicUrl = '';
const env = getClientEnvironment(publicUrl);
const dependencies = require('./dependencies');
const alias = {}

for (const pkg in dependencies) {
  alias[pkg] = require.resolve(dependencies[pkg].script.dev)
}

module.exports = {
	devtool: 'cheap-module-source-map',
	entry: [
		require.resolve('react-dev-utils/webpackHotDevClient'),
		require.resolve('./polyfills'),
		require.resolve('react-error-overlay'),
		paths.appIndexJs
	],
	output: {
		path: paths.appBuild,
		pathinfo: true,
		filename: `static/js/framework-${pkg.version}.js`,
		chunkFilename: 'static/js/[name].chunk.js',
		publicPath: publicPath,
		devtoolModuleFilenameTemplate: info =>
			path.resolve(info.absoluteResourcePath).replace(/\\/g, '/'),
	},
	resolve: {
    alias: alias,
		modules: ['node_modules', paths.appNodeModules].concat(
			process.env.NODE_PATH.split(path.delimiter).filter(Boolean)
		),
		extensions: ['.web.js', '.js', '.json', '.web.jsx', '.jsx'],
		plugins: [
			new ModuleScopePlugin(paths.appSrc),
		]
	},
	module: {
		// noParse: function (content) {
		// 	const _dependencies = Object.keys(dependencies);
    //   if (_dependencies.map(pkg => require.resolve(pkg)).indexOf(content) !== -1) {
    //     console.log('content:', content);
    //     process.exit(1);
    //   }
		// 	return _dependencies.map(pkg => require.resolve(pkg)).indexOf(content) !== -1
		// },
		strictExportPresence: true,
		rules: [{
				test: /\.(js|jsx)$/,
				enforce: 'pre',
				use: [{
					options: {
						formatter: eslintFormatter,

					},
					loader: require.resolve('eslint-loader'),
				}, ],
				include: paths.appSrc,
			},
			{
				exclude: [
					/\.html$/,
					/\.(js|jsx)$/,
					/\.s?css$/,
					/\.json$/,
					/\.bmp$/,
					/\.gif$/,
					/\.jpe?g$/,
					/\.png$/,
				],
				loader: require.resolve('file-loader'),
				options: {
					name: 'static/media/[name].[hash:8].[ext]',
				},
			},
			{
				test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
				loader: require.resolve('url-loader'),
				options: {
					limit: 10000,
					name: 'static/media/[name].[hash:8].[ext]',
				},
			},
			{
				test: /\.(js|jsx)$/,
				include: paths.appSrc,
				loader: require.resolve('babel-loader'),
				options: {
					cacheDirectory: true
				},
			},
			{
				test: /\.css$/,
				use: [
					require.resolve('style-loader'),
					require.resolve('css-loader')
				]
			},
			{
				test: /\.scss$/,
				use: [
					require.resolve('style-loader'),
					{
						loader: require.resolve('css-loader'),
						options: {
							sourceMap: true,
							modules: true,
							localIdentName: '[local]--[hash:base64:5]'
						},
					},
					{
						loader: require.resolve('postcss-loader'),
						options: {
							sourceMap: true,
							ident: 'postcss',
							plugins: () => [
								require('postcss-flexbugs-fixes'),
								autoprefixer({
									browsers: [
										'last 5 versions',
										'Firefox ESR',
										'not ie < 9',
									],
									flexbox: 'no-2009',
								}),
							],
						},
					},
					{
						loader: "sass-loader",
						options: {
							sourceMap: true,
							data: `
                $PUBLIC_PATH: '${env.raw.PUBLIC_PATH}';
                $NODE_ENV: '${env.raw.NODE_ENV}';
              `
						}
					}
				]
			}
		].concat(Object.keys(dependencies).map(key => ({
      test: require.resolve(dependencies[key].script.dev),
      loader: 'expose-loader',
      options: dependencies[key].global
    })))
	},
	plugins: [
		new InterpolateHtmlPlugin(env.raw),
		new HtmlWebpackPlugin({
			inject: true,
			template: `!!raw-loader!${paths.appHtml}`,
		}),
		new webpack.NamedModulesPlugin(),
		new webpack.DefinePlugin(env.stringified),
		new webpack.HotModuleReplacementPlugin(),
		new CaseSensitivePathsPlugin(),
		new WatchMissingNodeModulesPlugin(paths.appNodeModules),
		// new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
		// new StyleLintPlugin({})
	],
	node: {
		dgram: 'empty',
		fs: 'empty',
		net: 'empty',
		tls: 'empty',
	},
	performance: {
		hints: false,
	}
};

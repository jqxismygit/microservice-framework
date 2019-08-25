'use strict';

const autoprefixer = require('autoprefixer');
const path = require('path');
const pkg = require('../package');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const InterpolateHtmlPlugin = require('./plugins/InterpolateHtmlPlugin');
const eslintFormatter = require('react-dev-utils/eslintFormatter');
const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin');
const paths = require('./paths');
const getClientEnvironment = require('./env');
const publicPath = paths.servedPath;
const shouldUseRelativeAssetPaths = publicPath === './';
const publicUrl = publicPath.slice(0, -1);
const env = getClientEnvironment(publicUrl);
const dependencies = require('./dependencies');
const alias = {}

for (const pkg in dependencies) {
	alias[pkg] = require.resolve(dependencies[pkg].script.prod)
}

if (env.stringified['process.env'].NODE_ENV !== '"production"') {
	throw new Error('Production builds must have NODE_ENV=production.');
}

const cssFilename = 'static/css/[name].[contenthash:8].css';
const extractTextPluginOptions = shouldUseRelativeAssetPaths ? // Making sure that the publicPath goes back to to build folder.
	{ publicPath: Array(cssFilename.split('/').length).join('../') } : {};

module.exports = {
	bail: true,
	devtool: 'source-map',
	entry: [
		require.resolve('./polyfills'),
		paths.appIndexJs
  ],
	output: {
		path: paths.appBuild,
		filename: `static/js/framework-${pkg.version}.js`,
		chunkFilename: 'static/js/[name].[chunkhash:8].chunk.js',
		publicPath: publicPath,
		devtoolModuleFilenameTemplate: info =>
			path
			.relative(paths.appSrc, info.absoluteResourcePath)
			.replace(/\\/g, '/'),
	},
	resolve: {
		modules: ['node_modules', paths.appNodeModules].concat(
			process.env.NODE_PATH.split(path.delimiter).filter(Boolean)
		),
		extensions: ['.web.js', '.js', '.json', '.web.jsx', '.jsx'],
		alias: alias,
		plugins: [
			new ModuleScopePlugin(paths.appSrc),
		],
	},
	module: {
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
					compact: true,
				},
			},
			{
				test: /\.css$/,
				loader: ExtractTextPlugin.extract(
					Object.assign({
							fallback: require.resolve('style-loader'),
							use: [{
									loader: require.resolve('css-loader'),
									options: {
										importLoaders: 1,
										minimize: true,
										sourceMap: false,
									},
								},
								{
									loader: require.resolve('postcss-loader'),
									options: {
										ident: 'postcss',
										plugins: () => [
											require('postcss-flexbugs-fixes'),
											autoprefixer({
												browsers: [
													'last 6 versions'
												]
											}),
										],
									},
								},
							],
						},
						extractTextPluginOptions
					)
				),
			},
			{
				test: /\.scss$/,
				loader: ExtractTextPlugin.extract(
					Object.assign({
							fallback: require.resolve('style-loader'),
							use: [{
									loader: require.resolve('css-loader'),
									options: {
										importLoaders: 1,
										minimize: true,
										sourceMap: false,
										modules: true,
										localIdentName: '[hash:base64:12]'
									},
								},
								{
									loader: require.resolve('postcss-loader'),
									options: {
										sourceMap: false,
										ident: 'postcss',
										plugins: () => [
											require('postcss-flexbugs-fixes'),
											autoprefixer({
												browsers: [
													'last 6 versions'
												]
											}),
										],
									},
								},
								{
									loader: "sass-loader",
									options: {
										sourceMap: false,
										data: `
                      $PUBLIC_PATH: '${env.raw.PUBLIC_PATH}';
                      $NODE_ENV: '${env.raw.NODE_ENV}';
                    `
									}
								}
							]
						},
						extractTextPluginOptions
					)
				)
			},
		].concat(Object.keys(dependencies).map(key => ({
			test: require.resolve(dependencies[key].script.prod),
			loader: 'expose-loader',
			options: dependencies[key].global
		})))
	},
	plugins: [
		new InterpolateHtmlPlugin(env.raw),
		new HtmlWebpackPlugin({
			inject: true,
			template: `!!raw-loader!${paths.appHtml}`,
			filename: 'index.html',
			minify: {
				removeComments: true,
				collapseWhitespace: true,
				removeRedundantAttributes: true,
				useShortDoctype: true,
				removeEmptyAttributes: true,
				removeStyleLinkTypeAttributes: true,
				keepClosingSlash: true,
				minifyJS: true,
				minifyCSS: true,
				minifyURLs: true,
			},
		}),
		new webpack.DefinePlugin(env.stringified),
		new webpack.optimize.UglifyJsPlugin({
			compress: {
				warnings: false,
				comparisons: false,
			},
			output: {
				comments: false,
				ascii_only: true,
			},
			sourceMap: false,
		}),
		new ExtractTextPlugin({
			filename: cssFilename,
		}),
		new ManifestPlugin({
			fileName: 'asset-manifest.json',
		}),
		// new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
	],
	node: {
		dgram: 'empty',
		fs: 'empty',
		net: 'empty',
		tls: 'empty',
	},
};

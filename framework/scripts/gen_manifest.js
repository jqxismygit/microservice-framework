#!/usr/bin/env node

var recursive = require('recursive-readdir');
var hashFile = require('md5-file');
var path = require('path');
var fs = require('fs');
var crypto = require('crypto');
var exec = require('child_process').exec;
var pkg = require(path.resolve(__dirname, '../package.json'));
var build_dir = process.env.BUILD_DIR || path.resolve(__dirname, '../build');

if (!fs.existsSync(build_dir)) {
	console.error('BUILD_DIR not exists:', build_dir);
} else {
	recursive(build_dir, ['*manifest.json', 'cordova.js', 'app.json', 'app_dev.json', '*.html', '*.map'], function (err, files) {
		var items = []

		files.forEach(function (file) {
			const hash = hashFile.sync(file);
			const stat = fs.statSync(file);

			items.push({
				url: process.env.PUBLIC_PATH + file.replace(build_dir, ''),
				hash: hash,
				size: stat.size
			});
		})

		fs.writeFileSync(path.resolve(build_dir, 'manifest.json'), JSON.stringify(items))
	});
}

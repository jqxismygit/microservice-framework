#!/usr/bin/env node

const fs = require('fs')
const chalk = require('chalk')
const path = require('path')
const URI = require('urijs')
const webpack = require('webpack')
const hashFile = require('md5-file')
const {
  exec
} = require('child_process')
const recursive = require('recursive-readdir')
const devUtils = require('./utils')
const pkg = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), 'package.json')))

process.env.NODE_ENV = process.env.NODE_ENV || 'development'
process.env.PACKAGE_NAME = pkg.name
process.env.PACKAGE_VERSION = process.env.NODE_ENV === 'development' ? 'development' : pkg.version
process.env.PACKAGE_DIR = process.cwd()
process.env.PUBLIC_PATH = process.env.PUBLIC_PATH || `http://localhost:3000/_modules/${pkg.name}/${process.env.PACKAGE_VERSION}`
process.env.OUTPUT_BASE_DIR = process.env.OUTPUT_BASE_DIR || path.resolve(__dirname, '../dist')
process.env.OUTPUT_PATH = process.env.OUTPUT_PATH || path.resolve(process.env.OUTPUT_BASE_DIR, process.env.PACKAGE_NAME, process.env.PACKAGE_VERSION)

console.log(chalk.green('process.env.NODE_ENV:'), process.env.NODE_ENV)
console.log(chalk.green('process.env.PACKAGE_NAME:'), process.env.PACKAGE_NAME)
console.log(chalk.green('process.env.PACKAGE_VERSION:'), process.env.PACKAGE_VERSION)
console.log(chalk.green('process.env.PACKAGE_DIR:'), process.env.PACKAGE_DIR)
console.log(chalk.green('process.env.PUBLIC_PATH:'), process.env.PUBLIC_PATH)
console.log(chalk.green('process.env.OUTPUT_BASE_DIR:'), process.env.OUTPUT_BASE_DIR)
console.log(chalk.green('process.env.OUTPUT_PATH:'), process.env.OUTPUT_PATH)
console.log('')

const webpackConfig = require('../configs/webpack.config.js')
const compiler = webpack(webpackConfig)
const manifestPath = path.resolve(process.env.OUTPUT_PATH, 'manifest.json')
const manifestIgnoreFiles = ['*manifest.json', '.*']

if (process.env.NODE_ENV !== 'production') {
  compiler.watch({}, (err, stats) => {
    if (err) {
      throw err
    }

    console.log(`>> Package [${chalk.green(process.env.PACKAGE_NAME)}] watching ...`)
  })
} else {
  compiler.run((err, stats) => {
    if (err) {
      throw err
    }

    const chunk = devUtils.getAssets(stats, process.env.PUBLIC_PATH)

    recursive(process.env.OUTPUT_PATH, manifestIgnoreFiles, (err, files) => {
      const assets = files.map(file => {
        const hash = hashFile.sync(file)
        const stat = fs.statSync(file)
        const filePath = file.replace(process.env.OUTPUT_PATH, '')

        return {
          hash,
          size: stat.size,
          url: new URI(process.env.PUBLIC_PATH + filePath).normalize().toString()
        }
      })

      const manifest = {
        package: process.env.PACKAGE_NAME,
        version: process.env.PACKAGE_VERSION,
        release_time: +new Date(),
        chunk,
        assets
      }

      fs.writeFile(manifestPath, JSON.stringify(manifest), err => {
        if (err) {
          console.error(err)
          throw err
        }

        console.log(`[ ${pkg.name}@${process.env.PACKAGE_VERSION} ] ${chalk.green('Complate')} 🎉`)
        console.log(' ')
      })

    })
  })
}

// 😁 https://apps.timwhitlock.info/emoji/tables/unicode

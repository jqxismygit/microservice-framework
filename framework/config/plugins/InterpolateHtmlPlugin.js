// const escapeStringRegexp = require('escape-string-regexp');
const _ = require('lodash');

class InterpolateHtmlPlugin {
  constructor(replacements) {
    this.replacements = replacements;
  }

  apply(compiler) {
    compiler.plugin('compilation', compilation => {
      compilation.plugin( 'html-webpack-plugin-before-html-processing',
        (data, callback) => {
          data.html = _.template(data.html)(this.replacements);
          callback(null, data);
        }
      );
    });
  }
}

module.exports = InterpolateHtmlPlugin;

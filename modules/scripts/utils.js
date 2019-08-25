exports.getAssets = function (stats, publicPath = '') {
  const chunks = stats.toJson().chunks;
  const assets = {
    hash: stats.hash,
    publicPath: publicPath, //publicPath
    js: [],
    css: [],
    chunks: {}
  };

  chunks.forEach(function (chunk) {
    const chunkName = chunk.names[0];
    const entry = chunk.files[0];
    const css = chunk.files.filter(file => /.css($|\?)/.test(file));

    assets.chunks[chunkName] = {
      size: chunk.size,
      entry: entry,
      hash: chunk.hash,
      css: css
    };

    assets.js.push(entry);
    assets.css = assets.css.concat(css);
  });

  return assets;
}

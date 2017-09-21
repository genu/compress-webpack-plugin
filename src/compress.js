import url from 'url';
import async from 'async';
import RawSource from 'webpack-sources/lib/RawSource';

class CompressPlugin {
  constructor(options = {}) {
    this.asset = options.asset || '[path].gz[query]';
    this.algorithm = options.algorithm || 'gzip';
    this.filename = options.filename || false;
    this.compressionOptions = {};

    if (typeof this.algorithm === 'string') {
      const zlib = require('zlib');
      this.algorithm = zlib[this.algorithm];

      if (!this.algorithm) {
        throw new Error('Algorithm not found in zlib');
      }

      this.compressionOptions = {
        level: options.level || 9,
        flush: options.flush,
        chunkSize: options.chunkSize,
        windowBits: options.windowBits,
        memLevel: options.memLevel,
        strategy: options.strategy,
        dictionary: options.dictionary,
      };
    }
    this.test = options.test || options.regExp;
    this.threshold = options.threshold || 0;
    this.minRatio = options.minRatio || 0.8;
    this.deleteOriginalAssets =
      options.deleteOriginalAssets || false;
  }

  apply(compiler) {
    compiler.plugin('compilation', (compilation) => {
      compilation.plugin(
        'html-webpack-plugin-after-html-processing',
        (htmlPluginData, callback) => {
          const assets = compilation.assets;

          async.forEach(
            Object.keys(assets),
            (file, cb) => {
              if (Array.isArray(this.test)) {
                if (this.test.every(t => !t.test(file))) {
                  return cb();
                }
              } else if (
                this.test &&
                !this.test.test(file)
              ) {
                return cb();
              }
              const asset = assets[file];
              let content = asset.source();

              if (!Buffer.isBuffer(content)) {
                content = new Buffer(content, 'utf-8');
              }

              const originalSize = content.length;

              if (originalSize < this.threshold) {
                return cb();
              }

              this.algorithm(
                content,
                this.compressionOptions,
                (err, result) => {
                  if (err) {
                    return cb(err);
                  }

                  if (
                    result.length / originalSize >
                    this.minRatio
                  ) {
                    return cb();
                  }

                  const parse = url.parse(file);
                  const sub = {
                    file,
                    path: parse.pathname,
                    query: parse.query || '',
                  };

                  let newFile = this.asset.replace(
                    /\[(file|path|query)\]/g,
                    (p0, p1) => sub[p1],
                  );

                  if (typeof this.filename === 'function') {
                    newFile = this.filename(newFile);
                  }
                  assets[newFile] = new RawSource(result);
                  if (this.deleteOriginalAssets) {
                    delete assets[file];
                  }

                  htmlPluginData.html = htmlPluginData.html.replace(
                    file,
                    newFile,
                  );
                  cb();
                },
              );
            },
            callback,
          );
        },
      );
    });
  }
}

export default CompressPlugin;

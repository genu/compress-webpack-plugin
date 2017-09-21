[![deps][deps]][deps-url]

<div align="center">
  <!-- replace with accurate logo e.g from https://worldvectorlogo.com/ -->
  <a href="https://github.com/webpack/webpack">
    <img width="200" height="200" vspace="" hspace="25"
      src="https://cdn.rawgit.com/webpack/media/e7485eb2/logo/icon.svg">
  </a>
  <h1>CompressPlugin</h1>
  <p>Prepare compressed versions of assets to serve them with Content-Encoding. Based on `compression-webpack-plugin`<p>
</div>

<h2 align="center">Install</h2>

```bash
npm i -D compress-webpack-plugin
```

<h2 align="center">Usage</h2>

``` javascript
var CompressPlugin = require("compress-webpack-plugin");
module.exports = {
	plugins: [
		new CompressPlugin({
			asset: "[path].gz[query]",
			algorithm: "gzip",
			test: /\.(js|html)$/,
			threshold: 10240,
			minRatio: 0.8
		})
	]
}
```

Arguments:

* `asset`: The target asset name. `[file]` is replaced with the original asset. `[path]` is replaced with the path of the original asset and `[query]` with the query. Defaults to `"[path].gz[query]"`.
* `filename`: A `function(asset)` which receives the asset name (after processing `asset` option) and returns the new asset name. Defaults to `false`.
* `algorithm`: Can be a `function(buf, callback)` or a string. For a string the algorithm is taken from `zlib` (or zopfli for `zopfli`). Defaults to `"gzip"`.
* `test`: All assets matching this RegExp are processed. Defaults to every asset.
* `threshold`: Only assets bigger than this size are processed. In bytes. Defaults to `0`.
* `minRatio`: Only assets that compress better that this ratio are processed. Defaults to `0.8`.
* `deleteOriginalAssets`: Whether to delete the original assets or not. Defaults to `false`.

Option Arguments for Zopfli (see [node-zopfli](https://github.com/pierreinglebert/node-zopfli#options) doc for details):
* verbose: Default: false,
* verbose_more: Default: false,
* numiterations: Default: 15,
* blocksplitting: Default: true,
* blocksplittinglast: Default: false,
* blocksplittingmax: Default: 15

[deps]: https://david-dm.org/genu/compress-webpack-plugin.svg
[deps-url]: https://david-dm.org/genu/compress-webpack-plugin

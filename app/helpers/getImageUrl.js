/**
 * Handlebars helper to translate cache:// image URLs to relative URLs for
 * loading.
 */
module.exports = function(image) {
  if (!image) {
    return '';
  }

  if (image.class === 'NativeImage') {
    // TODO
  } else {
    var cacheUrl = image.src['x' + App.imageDensity],
        path = cacheUrl.replace('cache://', 'bundle/');

    return App.bundleManager.getResourceUrl(path);
  }
};

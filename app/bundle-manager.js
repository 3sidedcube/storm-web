window.requestFileSystem = window.requestFileSystem ||
    window.webkitRequestFileSystem;

var FileSystem = require('./file-system');

/** @const {string} */
var RESOURCE_MAP_PATH = 'updatedResources.dat';

module.exports = Backbone.Model.extend({
  /** @override @constructor */
  initialize: function() {
    /** @private @type {Object.<string, boolean>} */
    this.updatedResources_ = {};
    /** @private @type {FileSystem} */
    this.fs_ = null;
  },

  /**
   * Initialises the in-browser filesystem and loads in the cached map of
   * updated resources.
   * @returns {Promise} Promise which resolves on cache load completion.
   */
  init: function() {
    this.fs_ = FileSystem;

    var self = this;

    return new Promise(function(resolve, reject) {
      FileSystem.init()
          .then(function() {
            return FileSystem.readFileAsText(RESOURCE_MAP_PATH);
          }, reject)
          .then(function(data) {
            var paths = data.split('\n');

            for (var i = 0; i < paths.length; i++) {
              self.updatedResources_[paths[i]] = true;
            }

            resolve();
          }, resolve);
    });
  },

  /**
   * Checks for bundle delta updates. If found, downloads, unpacks and updates
   * the resource map.
   */
  update: function() {
    // TODO
  },

  /**
   * Resolves the correct path to a bundle resource for a cache: protocol URL.
   * Will return relative paths to bundled resources, and cdvfile: protocol
   * URLs for resources updated in a delta update.
   * @param url The cache:// URL to resolve.
   * @returns {string} Path to the resource from the bundle.
   */
  getResourceUrl: function(url) {
    var localPath = url.replace('cache://', 'bundle/');

    if (this.updatedResources_[localPath]) {
      return 'cdvfile://persistent/' + localPath;
    }

    return localPath;
  }
});

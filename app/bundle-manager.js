window.requestFileSystem = window.requestFileSystem ||
    window.webkitRequestFileSystem;

var FileSystem   = require('./file-system'),
    BundleUpdate = require('./bundle-update');

/** @const {string} */
var RESOURCE_MAP_PATH = 'updatedResources.dat';

/**
 * Manages local bundle updating and resolving cache:// URLs to either original
 * bundle resources or resources downloaded through a delta.
 */
module.exports = Backbone.Model.extend({
  /** @override @constructor */
  initialize: function(options) {
    if (options.appId === undefined) {
      throw new Error('No app ID specified');
    }

    /** @private @type {number} */
    this.appId_ = options.appId;
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
    var timestamp    = App.manifest.get('timestamp'),
        bundleUpdate = new BundleUpdate({appId: this.appId_});

    console.info('Checking for update with timestamp', timestamp);

    this.listenTo(bundleUpdate, 'file', this.fileReceived_);

    bundleUpdate.download(timestamp).then(function() {
      this.off('file');
      this.persistUpdatedResources_();
    }.bind(this), function(xhr, e) {
      this.off('file');

      console.error('Error downloading/extracting delta bundle');
    }.bind(this));
  },

  /**
   * Resolves the correct path to a bundle resource for a cache: protocol URL.
   * Will return relative paths to bundled resources, and cdvfile: protocol
   * URLs for resources updated in a delta update.
   * @param url The cache:// URL to resolve.
   * @returns {string} Path to the resource from the bundle.
   */
  getResourceUrl: function(url) {
    if (typeof url !== 'string') {
      return url;
    }

    var localPath = url.replace('cache://', 'bundle/');

    if (this.updatedResources_[localPath]) {
      return 'cdvfile://persistent/' + localPath;
    }

    return localPath;
  },

  /**
   * Handles each file from the update bundle individually. Writes out to the
   * file system and updates the resources map.
   * @param {string} path Path to the file within the bundle.
   * @param {string} data File data as a string.
   * @private
   */
  fileReceived_: function(path, data) {
    var updatedResources = this.updatedResources_;

    console.log('Received updated file', path);

    this.fs_.writeFile('bundle/' + path, data).then(function() {
      updatedResources['bundle/' + path] = true;
    }, function(e) {
      console.error('Failed to write file', path, e);
    });
  },

  /**
   * Writes the updated resources map out to the file system.
   * @return {Promise} Promise wrapping the file system write operation.
   * @private
   */
  persistUpdatedResources_: function() {
    var data = Object.keys(this.updatedResources_).join('\n');

    return FileSystem.writeFile(RESOURCE_MAP_PATH, data);
  }
});

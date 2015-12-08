window.requestFileSystem = window.requestFileSystem ||
    window.webkitRequestFileSystem;

var FileSystem   = require('./file-system'),
    UpdateWorker =
        require('worker?name=update.worker.js!./bundle-update.worker');

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
    var timestamp = App.manifest.get('timestamp'),
        worker    = new UpdateWorker();

    worker.onmessage = function(e) {
      var writes = e.data.files.map(this.persistUpdatedFile_.bind(this));

      Promise.all(writes).then(this.persistUpdatedResources_.bind(this));
    }.bind(this);

    worker.postMessage({
      appId: this.appId_,
      apiRoot: App.apiRoot,
      timestamp: timestamp
    });
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
      return 'ms-appdata:///local/' + localPath;
    }

    return localPath;
  },

  /**
   * Handles each file from the update bundle individually. Writes out to the
   * file system and updates the resources map.
   * @param {Object} file Object representing a single file.
   * @returns {Promise} Promise wrapping the file system write operation.
   * @private
   */
  persistUpdatedFile_: function(file) {
    var updatedResources = this.updatedResources_,
        path             = file.name,
        data             = file.blob;

    console.log('Received updated file', path);

    return this.fs_.writeFile('bundle/' + path, data).then(function() {
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
    var data = Object.keys(this.updatedResources_).join('\n'),
        blob = new Blob([data], {type: 'text/plain'});

    return FileSystem.writeFile(RESOURCE_MAP_PATH, blob);
  }
});

window.requestFileSystem = window.requestFileSystem ||
    window.webkitRequestFileSystem;

/** @const {number} */
var FS_SIZE = 10 * 1024 * 1024; // 10MB

/**
 * Wraps around the HTML5 FileSystem API to provide read/write access to
 * sandboxed files by path.
 */
var FileSystem = Backbone.Model.extend({
  /** @override @constructor */
  initialize: function() {
    /** @private @type {FileSystem} */
    this.fs_ = null;
  },

  /**
   * Sets up the filesystem for use. This method must be called before any
   * other operations are attempted.
   * @returns {Promise} Promise for initialisation completion.
   */
  init: function() {
    var self = this;

    return new Promise(function(resolve, reject) {
      window.requestFileSystem(window.PERSISTENT, FS_SIZE, function(fs) {
        self.fs_ = fs;
        resolve();
      }, reject);
    });
  },

  /**
   * Reads the file at the specified {@param path}
   * @param {string} path Path to the file to read.
   * @returns {Promise} Promise which will resolve with the text content of the
   *     file or reject with an error if the path does not exist.
   */
  readFileAsText: function(path) {
    var fs = this.fs_;

    if (!fs) {
      throw new Error('FileSystem has not been initialised');
    }

    return new Promise(function(resolve, reject) {
      fs.root.readFile(path, {}, function(fileEntry) {
        fileEntry.file(function(file) {
          var reader = new FileReader();

          reader.onloadend = function() {
            resolve(this.result);
          };

          reader.readAsText(file);
        });
      }, reject);
    });
  }
});

module.exports = new FileSystem();

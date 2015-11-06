/**
 * Fake implementation of {@link FileSystem} for unit testing, reading/writing
 * to files in-memory.
 * @extends FileSystem
 */
var FakeFileSystem = Backbone.Model.extend({
  initialize: function() {
    /** @private @type {Object.<string, string>} */
    this.files_ = null;
  },

  /** @override */
  init: function() {
    var self = this;

    return new Promise(function(resolve) {
      if (!self.files_) {
        self.files_ = {};
      }

      resolve();
    });
  },

  /** @override */
  readFileAsText: function(path) {
    var files = this.files_;

    if (!files) {
      throw new Error('FileSystem has not been initialised');
    }

    return new Promise(function(resolve, reject) {
      if (!(path in files)) {
        reject();
      } else {
        resolve(files[path]);
      }
    });
  }
});

module.exports = new FakeFileSystem();

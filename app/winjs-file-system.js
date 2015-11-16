/**
 * Wraps around the Windows.Storage API to provide read/write access to
 * sandboxed files by path.
 */
module.exports = Backbone.Model.extend({
   /**
   * Sets up the filesystem for use. This method must be called before any
   * other operations are attempted.
   * @returns {Promise} Promise for initialisation completion.
   */
  init: function() {
    return Promise.resolve();
  },

  /**
   * Reads the file at the specified {@param path}
   * @param {string} path Path to the file to read.
   * @returns {Promise} Promise which will resolve with the text content of the
   *     file or reject with an error if the path does not exist.
   */
  readFileAsText: function(path) {
    return Promise.reject(path);
  }
});

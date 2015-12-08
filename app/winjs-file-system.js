/* global Windows */

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
    /** @private @type {StorageFolder} */
    this.rootFolder_ = Windows.Storage.ApplicationData.current.localFolder;

    return Promise.resolve();
  },

  /**
   * Reads the file at the specified {@param path}
   * @param {string} path Path to the file to read.
   * @returns {Promise} Promise which will resolve with the text content of the
   *     file or reject with an error if the path does not exist.
   */
  readFileAsText: function(path) {
    var rootFolder = this.rootFolder_;

    return new Promise(function(resolve, reject) {
      rootFolder.getFileAsync(path)
          .then(function(file) {
            return Windows.Storage.FileIO.readTextAsync(file);
          }, reject)
          .then(function(data) {
            resolve(data);
          }, reject);
    });
  },

  /**
   * Writes data to a file at the specified path. Any missing directories in
   * the path will be created, and any existing files will be overwritten
   * @param {string} path Path to the file to write, relative to the
   *     application root.
   * @param {string} data The data to write to the file.
   */
  writeFile: function(path, data) {
    var pathComponents = path.match(/(.*?)(?:\/)?([^\/]+)$/),
        dir            = pathComponents[1],
        rootFolder     = this.rootFolder_;

    var replace = Windows.Storage.CreationCollisionOption.replaceExisting;

    return new Promise(function(resolve, reject) {
      this.createDirectories_(dir, rootFolder)
          .then(function(folder) {
            return folder.createFileAsync(pathComponents[2], replace);
          }, reject)
          .then(function(file) {
            return Windows.Storage.FileIO.writeTextAsync(file, data);
          }, reject)
          .then(resolve, reject);
    }.bind(this));
  },

  /**
   * Creates all subfolders in a path, returning the lowest level
   * StorageFolder. Will return an existing directory if it already exists.
   * @param {String} path The path to the lowest subfolder you want a reference
   *     to (file names at the end will be removed)
   * @param {StorageFolder} rootFolder The folder to begin at for this
   *     iteration (this is a recursive function)
   * @return {Promise} Promise completes with the lowest level folder in the
   *     given path, creating subfolders along the way
   */
  createDirectories_: function(path, rootFolder) {
    // Remove a possible filename from the end of the path and fix slashes.
    var normalizedPath = path.replace(/\\/g, '/')
        .replace(/\/?[^\/]+\.[^\.\/]+$/, '');

    var folders           = normalizedPath.split(/\//),
        dir               = folders.shift(),
        createDirectories = this.createDirectories_.bind(this);

    return new WinJS.Promise(function(resolve, reject) {
      if (!dir || !dir.length) {
        resolve(rootFolder);
        return;
      }

      // Create the next subfolder.
      var openIfExists = Windows.Storage.CreationCollisionOption.openIfExists;

      rootFolder.createFolderAsync(dir, openIfExists)
          .then(function(folder) {
            // Create any remaining subfolders.
            return createDirectories(folders.join('/'), folder);
          }, reject)
          .then(resolve, reject);
    });
  }
});

/* global TarGZ */
require('./vendor/gzip');

/**
 * Allows for querying the Storm API to check for bundle delta updates.
 */
module.exports = Backbone.Model.extend({
  /** @override @constructor */
  initialize: function(options) {
    if (options.appId === undefined) {
      throw new Error('No app ID specified');
    }

    /** @private @type {number} */
    this.appId_ = options.appId;
  },

  /** @override */
  url: function() {
    return App.apiRoot + 'apps/' + this.appId_ + '/update';
  },

  /**
   * Fetches the delta bundle archive containing all changed files since the
   * specified {@param timestamp}.
   *
   * Each file will be emitted from the delta individually in a 'file' event,
   * with two parameters: the path to the file in the delta ({@type string})
   * and the file content ({@type string}).
   * @param {number} timestamp Unix timestamp specifying the time of the last
   *     update.
   * @returns {Promise} Promise which will fulfill once all files have been
   *     emitted, and reject if one or more errors occur.
   */
  download: function(timestamp) {
    var url      = this.url() + '?timestamp=' + timestamp,
        onstream = this.gzipStreamHandler_.bind(this);

    return new Promise(function(resolve, reject) {
      TarGZ.load(url, resolve, onstream, reject);
    });
  },

  /**
   * Handles stream events from the bundle file.
   * @param {Object} file Data for an individual file from the bundle.
   * @private
   */
  gzipStreamHandler_: function(file) {
    // Ignore directories.
    if (file.fileType === '5') {
      return;
    }

    this.trigger('file', file.filename, file.data);
  }
});

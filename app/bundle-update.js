var TarGZ = require('./vendor/untar');

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
   * with an object represenging the file as a parameter..
   * @param {number} timestamp Unix timestamp specifying the time of the last
   *     update.
   * @returns {Promise} Promise which will fulfill once all files have been
   *     emitted, and reject if one or more errors occur.
   */
  download: function(timestamp) {
    var url         = this.url() + '?timestamp=' + timestamp,
        fileHandler = this.gzipStreamHandler_.bind(this);

    return new Promise(function(resolve, reject) {
      var xhr = new XMLHttpRequest();

      xhr.onload = function() {
        if (xhr.status === 304) {
          console.log('No update available');
          resolve();
          return;
        }

        var tar = new TarGZ(xhr.response);

        tar.extract();
        tar.files.forEach(fileHandler);
      };

      xhr.onerror = function() {
        console.log('Failed to check for update');
        reject();
      };

      xhr.open('GET', url, true);
      xhr.overrideMimeType('text/plain');
      xhr.responseType = 'arraybuffer';
      xhr.setRequestHeader('Content-Type', 'text/plain');
      xhr.send(null);
    });
  },

  /**
   * Handles stream events from the bundle file.
   * @param {Object} file Data for an individual file from the bundle.
   * @private
   */
  gzipStreamHandler_: function(file) {
    // Only handle regular files.
    if (file.type !== TarGZ.fileTypes.REGTYPE) {
      return;
    }

    this.trigger('file', file);
  }
});

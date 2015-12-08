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
   * @param {number} timestamp Unix timestamp specifying the time of the last
   *     update.
   * @returns {Promise} Promise which will fulfill with an array of all updated
   *     files.
   */
  download: function(timestamp) {
    var url = this.url() + '?timestamp=' + timestamp;

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

        // Only handle regular files (no directories).
        var files = tar.files.filter(function(file) {
          return file.type === TarGZ.fileTypes.REGTYPE;
        });

        resolve(files);
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
  }
});

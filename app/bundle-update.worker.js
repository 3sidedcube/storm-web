/* eslint-env worker */

if (!self.Promise) {
  require('es6-promise').polyfill();
}

var BundleUpdate = require('./bundle-update');

onmessage = function(e) {
  var request      = e.data,
      bundleUpdate = new BundleUpdate({
        appId: request.appId,
        apiRoot: request.apiRoot
      }),
      timestamp    = request.timestamp;

  console.info('Checking for update with timestamp', timestamp);

  bundleUpdate.download(timestamp)
      .then(function(files) {
        if (files) {
          postMessage({files: files});
        }

        close();
      }, function() {
        console.error('Error downloading/extracting delta bundle');
      });
};

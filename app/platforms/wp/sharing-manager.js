/* global Windows */

module.exports = {
  /**
   * Launches the device-native sharing dialog to share the specified content.
   * @param {string} title Title of the content to be shared.
   * @param {string} body Body text to be shared.
   * @param {string} [imageUrl] URL of an image to share.
   */
  share: function(title, body, imageUrl) {
    // Title is required or sharing will fail.
    if (!title) {
      title = ' ';
    }

    if (window.Windows) {
      var DataTransferManager = Windows.ApplicationModel.DataTransfer
          .DataTransferManager;

      var dtm = DataTransferManager.getForCurrentView();

      dtm.addEventListener('datarequested', function(e) {
        var request = e.request;

        request.data.properties.title = title;
        request.data.setText(body);

        if (imageUrl) {
          // Transform URL to absolute if required.
          if (!(/^(?:ms-appx||ms-appdata):/).exec(imageUrl)) {
            var l = document.location;

            imageUrl = l.protocol + '//' + l.host + '/' + imageUrl;
          }

          var StorageFile = Windows.Storage.StorageFile,
              uri      = new Windows.Foundation.Uri(imageUrl),
              deferral = request.getDeferral();

          StorageFile.getFileFromApplicationUriAsync(uri).done(function(file) {
            request.data.setStorageItems([file]);
            deferral.complete();
          });
        }
      });

      DataTransferManager.showShareUI();
    }
  }
};

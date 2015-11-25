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

      dtm.removeEventListener('datarequested');
      dtm.addEventListener('datarequested', function(e) {
        var request = e.request;

        request.data.properties.title = title;
        request.data.setText(body);

        if (imageUrl) {
          var Stream = Windows.Storage.Streams.RandomAccessStreamReference;

          request.data.properties.thumbnail =
              Stream.createFromUri(imageUrl);
          request.data.setBitmap(Stream.createFromUri(imageUrl));
        }
      });

      DataTransferManager.showShareUI();
    }
  }
};

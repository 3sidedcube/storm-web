module.exports = {
  /**
   * Launches the device-native sharing dialog to share the specified content.
   * @param {string} title Title of the content to be shared.
   * @param {string} body Body text to be shared.
   * @param {string} [imageUrl] URL of an image to share.
   */
  share: function(title, body, imageUrl) {
    throw new Error('Sharing not implemented. Attempted to share content:\n' +
        'Title: "' + title + '"\n' +
        'Body: "' + body + '"\n' +
        'Image URL: "' + imageUrl);
  }
};

module.exports = Backbone.Model.extend({
  url: function() {
    if (App.target === App.APP_TARGET_LOCAL) {
      var path = 'bundle/pages/' + this.id + '.json';

      return App.bundleManager.getResourceUrl(path);
    }

    return App.apiRoot + 'objects/' + this.id + '/stream';
  }
});

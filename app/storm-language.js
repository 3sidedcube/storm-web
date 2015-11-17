module.exports = Backbone.Model.extend({
  initialize: function(options) {
    this.src = options.lang.src;
  },

  url: function() {
    var path = 'bundle/languages/' + this.src;

    return App.bundleManager.getResourceUrl(path);
  }
});

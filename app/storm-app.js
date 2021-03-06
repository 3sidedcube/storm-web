module.exports = Backbone.Model.extend({
  url: function() {
    return App.bundleManager.getResourceUrl('bundle/app.json');
  },

  initialize: function() {
    this.map = {};
  },

  generateMap: function() {
    var pages = this.get('map') || [];

    for (var i = 0; i < pages.length; i++) {
      this.map[pages[i].src] = pages[i];
    }
  }
});

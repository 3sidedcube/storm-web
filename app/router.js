/* eslint-disable */
var TabbedPageCollection = require('current-platform/tabbed-page-collection/tabbed-page-collection-view'),
    NavigationController = require('./navigation-controller');
/* eslint-enable */

module.exports = Backbone.Router.extend({
  routes: {
    '': 'home',
    '*nomatch': 'page'
  },

  home: function() {
    var rootPage = App.app.get('vector');

    this.page(rootPage);
  },

  page: function(url) {
    var isBundledApp = App.mode === App.APP_MODE_FULL &&
        App.target === App.APP_TARGET_LOCAL;

    // Don't push content pages onto the root controller in full app mode.
    if (isBundledApp && TabbedPageCollection instanceof NavigationController) {
      var page = App.app.map[url];

      if (!page || page.type === 'ListPage') {
        var viewIsRoot = App.view.currentView.id === App.app.get('vector');

        if (!App.view.currentView || !viewIsRoot) {
          this.home();
          App.view.currentView.startUrl = url;
        } else {
          App.view.currentView.setPage(url);
        }

        return;
      }
    }

    App.view.setPage(url);
  }
});

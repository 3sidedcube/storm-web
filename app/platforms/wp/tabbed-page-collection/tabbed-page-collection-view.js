var PageView    = require('../../../page-view'),
    stormConfig = require('../../../../storm-config.json');

require('./tabbed-page-collection.less');

module.exports = PageView.extend({
  template: require('./tabbed-page-collection-view-template'),
  className: 'wp-TabbedPageCollection',

  getRenderData: function() {
    var data = this.model.toJSON(),
        tabs = data.pages ? data.pages.slice(0) : [];

    data.appName = App.app.get('title');
    data.appBarTabs = [];

    // Move specified pages from TabbedPageCollection to AppBar.
    var wpSettings = stormConfig['wp-settings'];

    if (wpSettings) {
      var appBarURLs = wpSettings['app-bar-urls'] || [];

      for (var i = 0; i < tabs.length; i++) {
        if (appBarURLs.indexOf(tabs[i].src) > -1) {
          data.appBarTabs.push(tabs[i]);
          tabs.splice(i, 1);
        }
      }
    }

    return data;
  },

  afterInitialize: function() {
    // Scroll offset is lost whenever this view is restored back from the view
    // stack. Dirty hack to put it back.
    this.on('ready', function() {
      var viewport = this.$('.win-pivot-viewport')[0];

      if (viewport) {
        viewport.scrollLeft = 20000;
      }
    }, this);
  },

  afterRender: function() {
    var PageViewBuilder = require('../../../page-view-builder'),
        self            = this;

    // Render out all main tab pages.
    this.$('.page-container').each(function() {
      var url  = $(this).data('src'),
          view = PageViewBuilder.build(url);

      self.listViews.push(view);

      $(this).html(view.render().el);
    });

    var pivot = this.$('.pivot')[0];

    // Don't continue processing if the model hasn't loaded yet.
    if (!this.model.get('pages')) {
      return;
    }

    WinJS.UI.process(pivot);
  }
});

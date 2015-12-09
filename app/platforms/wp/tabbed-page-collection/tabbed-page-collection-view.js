var PageView    = require('../../../page-view'),
    stormConfig = require('../../../../storm-config.json'),
    l           = require('../../../helpers/l');

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
      var appBarURLs = wpSettings['app-bar-urls'] || {};

      for (var i = 0; i < tabs.length; i++) {
        var content = appBarURLs[tabs[i].src];

        if (content) {
          var src = tabs[i].tabBarItem.image.src;

          src['x0.75'] = content.icon;
          src.x1 = content.icon;
          src['x1.5'] = content.icon;
          src.x2 = content.icon;
          src.x1 = content.icon;

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

    this.pageViews = [];

    // Render out all main tab pages.
    this.$('.page-container').each(function(i) {
      var url  = $(this).data('src'),
          view = PageViewBuilder.build(url);

      self.listViews.push(view);
      self.pageViews[i] = view;

      $(this).html(view.render().el);
    });

    var pivot = this.$('.pivot')[0];

    // Don't continue processing if the model hasn't loaded yet.
    if (!this.model.get('pages')) {
      return;
    }

    var pageViews = this.pageViews;

    WinJS.UI.process(pivot).done(function() {
      pivot.winControl.addEventListener('selectionchanged', function(e) {
        var pageView = pageViews[e.detail.index],
            name     = l(pageView.model.get('title'));

        if (App.analytics) {
          App.analytics.trackPageView(name);
        }
      });
    });
  }
});

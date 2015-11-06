var PageView = require('../../../page-view');

require('./tabbed-page-collection.less');

module.exports = PageView.extend({
  template: require('./tabbed-page-collection-view-template'),
  className: 'wp-TabbedPageCollection',

  getRenderData: function() {
    var data = this.model.toJSON(),
        tabs = data.pages || [];

    data.appName = App.app.get('title');
    data.appBarTabs = [];

    // TODO specify an array of page IDs to be linked to from app bar in
    // manifest.
    for (var i = 0; i < tabs.length; i++) {
      if (tabs[i].src === 'cache://pages/16330.json') {
        data.appBarTabs.push(tabs[i]);
        tabs.splice(i, 1);
      }
    }

    return data;
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

    setTimeout(function() {
      WinJS.UI.processAll();
    });
  }
});

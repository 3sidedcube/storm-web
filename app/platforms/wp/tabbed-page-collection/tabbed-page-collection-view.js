var PageView = require('../../../page-view')

require('./tabbed-page-collection.less')

module.exports = PageView.extend({
  template: require('./tabbed-page-collection-view-template'),
  className: 'wp-TabbedPageCollection',

  getRenderData: function() {
    var data = this.model.toJSON(),
        tabs = data.pages || []

    data.appName = App.app.get('title')

    if (tabs.length > 5) {
      this.moreTabs = tabs.splice(4, tabs.length - 4)
    }

    tabs.push({
      src: 'app://more',
      tabBarItem: {
        title: {
          content: 'cik0t'
        },
        image: {
          'class': 'Image',
          src: {
            x1: '',
            x2: ''
          }
        }
      }
    })

    return data
  },

  afterRender: function() {
    var PageViewBuilder = require('../../../page-view-builder'),
        self            = this

    // Render out all main tab pages.
    this.$('.page-container').each(function() {
      var url  = $(this).data('src'),
          view = PageViewBuilder.build(url)

      self.listViews.push(view)

      $(this).html(view.render().el)
    })

    setTimeout(function() {
      WinJS.UI.processAll()
    })
  }
})

var MAX_TABS = 5;

var NavigationController = require('../../../navigation-controller'),
    MorePageView         = require('../../../more-page-view/more-page-view'),
    localise             = require('../../../helpers/l');

module.exports = NavigationController.extend({
  template: require('./tabbed-page-collection-view-template'),
  className: 'TabbedPageCollection',

  events: {
    'click .clickable': 'linkClick'
  },

  getRenderData: function() {
    var data = this.model.toJSON(),
        tabs = data.pages || [];

    if (tabs.length > 5) {
      var moreTabs = tabs.splice(4, tabs.length - 4);
      MorePageView.tabs = moreTabs;

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
      });
    }

    return data;
  },

  ready: function() {
    this.render();

    if (!this.startUrl) {
      // Find start page.
      var pages     = this.model.get('pages'),
          startPage = pages[0].src;

      for (var i in pages) {
        if (pages[i].startPage) {
          startPage = pages[i].src;
          break;
        }
      }

      this.setPage(startPage, true);
      App.router.navigate(startPage, {replace: true});
    } else {
      this.setPage(this.startUrl);
    }

    this.trigger('ready');
  },

  linkClick: function(e) {
    var uri      = $(e.currentTarget).data('uri'),
        linkType = $(e.currentTarget).data('link-type'),
        newStack = $(e.currentTarget).data('clear-stack');

    if (linkType !== 'InternalLink') {
      return;
    }

    // Check if we need to push this view onto the root nav controller.
    var pageDescriptor = App.app.map[uri];

    if (pageDescriptor && pageDescriptor.type === 'QuizPage') {
      return;
    }

    this.setPage(uri, newStack);
    App.router.navigate(uri);

    if (e.currentTarget.classList.contains('TabBarItem')) {
      $('.TabBarItem.active').removeClass('active');
      $(e.currentTarget).addClass('active');
    }

    e.stopPropagation();
  },

  setPageTitle: function() {
    var title = localise(this.currentView.model.get('title'));
    this.$('> .navigation-controller-header .title').text(title);
  },

  setPage: function(id) {
    NavigationController.prototype.setPage.apply(this, arguments);

    // Set tab active state.
    var newTab = this.$('.TabBarItem[data-uri=\'' + id + '\']');

    if (newTab.length) {
      this.$('.TabBarItem.active').removeClass('active');
      newTab.addClass('active');
    }
  }
});

/* eslint-disable */
var PageTypes = {
  'Page': require('./page-view'),
  'ListPage': require('current-platform/list-page-view/list-page-view'),
  'TabbedPageCollection': require('current-platform/tabbed-page-collection/tabbed-page-collection-view'),
  'QuizPage': require('./quiz-page/quiz-page-view')
};
/* eslint-enable */

var NativeContent = {
  'more': require('./more-page-view/more-page-view'),
  'browser': require('./browser-view/browser-view')
};

module.exports = {
  build: function(url) {
    if (url.substr(0, 6) === 'app://') {
      var NativeView = NativeContent[url.substr(6)];

      if (!NativeView) {
        throw new Error('No native page implementation for this URL.');
      }

      return new NativeView();
    }

    var pageDescriptor = App.app.map[url],
        type;

    if (pageDescriptor) {
      type = pageDescriptor.type;
    } else {
      type = 'Page';
    }

    var PageView = PageTypes[type],
        id       = App.utils.getIdFromCacheUrl(url);

    return new PageView({
      id: id,
      url: url
    });
  },

  buildFromModel: function(url, model) {
    var type     = model.get('class'),
        PageView = PageTypes[type];

    return new PageView({
      model: model,
      url: url
    });
  }
};

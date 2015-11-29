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
  'browser': require('current-platform/browser-view/browser-view'),
  'video': require('./local-video-player-view/local-video-player-view')
};

module.exports = {
  build: function(url) {
    var nativeViewParams = url.match(/^app:\/\/([^\/]+)\/(.*)/);

    if (nativeViewParams !== null) {
      var NativeView = NativeContent[nativeViewParams[1]];

      if (nativeViewParams[1] === 'streaming-video') {
        throw new Error('Not yet implemented');
        // TODO implement
      }

      if (!NativeView) {
        throw new Error('No native page implementation for this URL.');
      }

      return new NativeView({params: nativeViewParams[2]});
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
      pageId: id,
      url: App.bundleManager.getResourceUrl(url)
    });
  },

  buildFromModel: function(url, model) {
    var type     = model.get('class'),
        PageView = PageTypes[type];

    return new PageView({
      model: model,
      url: App.bundleManager.getResourceUrl(url)
    });
  }
};

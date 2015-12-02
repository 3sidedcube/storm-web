var ListItemView = require('./list-item-view');

module.exports = ListItemView.extend({
  events: {
    'click': 'click'
  },

  /** @override @constructor */
  initialize: function() {
    // Handle deprecated VideoListItemView by transforming to new class.
    if (this.model.get('class') === 'VideoListItemView') {
      this.model = new Backbone.Model({
        class: 'MultiVideoListItemView',
        image: this.model.get('image'),
        attributes: this.model.get('attributes'),
        videos: [{
          class: 'video',
          src: this.model.get('link'),
          locale: ''
        }]
      });
    }
  },

  click: function() {
    // Get video for the current language (or default).
    var videos = this.model.get('videos'),
        video  = videos[0];

    videos.forEach(function(obj) {
      var locale = obj.locale;

      if (locale && App.language === locale.substr(4)) {
        video = obj;
      }
    });

    if (!video) {
      return;
    }

    var videoUrl = App.bundleManager.getResourceUrl(video.src.destination),
        appUrl;

    if (this.model.get('attributes').indexOf('loopable') > -1) {
      videoUrl += '|loop';
    }

    if (video.src.class === 'InternalLink') {
      appUrl = 'app://video/';
    } else {
      appUrl = 'app://streaming-video/';
    }

    App.router.navigate(appUrl + videoUrl, {trigger: true});
  }
});

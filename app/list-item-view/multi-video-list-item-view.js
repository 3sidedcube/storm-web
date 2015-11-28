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

    if (video.src.class === 'InternalLink') {
      // Local video.
      var url = App.bundleManager.getResourceUrl(video.src.destination);

      App.router.navigate('app://video/' + url, {trigger: true});
    } else {
      // Streaming video.
      document.location = video.src.destination;
    }
  }
});

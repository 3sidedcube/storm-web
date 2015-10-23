var ListItemView = require('./list-item-view');

module.exports = ListItemView.extend({
  events: {
    'click': 'click'
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
      document.location = video.src.destination.replace('cache://', 'bundle/');
    } else {
      // Streaming video.
      document.location = video.src.destination;
    }
  }
});

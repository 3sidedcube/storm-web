require('./local-video-player-view.less');

module.exports = Backbone.View.extend({
  template: require('./local-video-player-view-template'),
  className: 'local-video-player',

  /** @override @constructor */
  initialize: function(options) {
    var params = options.params.split('|');

    this.id = params[0];
    this.videoUrl = params[0];
    this.loop = false;

    if (params[1]) {
      var properties = params[1].split('&');

      for (var i = 0; i < properties.length; i++) {
        var param = properties[i];

        if (param === 'loop') {
          this.loop = true;
        }
      }
    }

    setTimeout(this.ready.bind(this));
  },

  /** @override */
  getRenderData: function() {
    return {
      videoUrl: this.videoUrl,
      loop: this.loop
    };
  },

  ready: function() {
    this.trigger('ready');
    this.render();
  }
});

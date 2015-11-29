require('./local-video-player-view.less');

module.exports = Backbone.View.extend({
  template: require('./local-video-player-view-template'),
  className: 'local-video-player',

  /** @override @constructor */
  initialize: function(options) {
    this.id = options.params;
    this.videoUrl = options.params;

    setTimeout(this.ready.bind(this));
  },

  /** @override */
  getRenderData: function() {
    return {
      videoUrl: this.videoUrl
    };
  },

  ready: function() {
    this.trigger('ready');
    this.render();
  }
});

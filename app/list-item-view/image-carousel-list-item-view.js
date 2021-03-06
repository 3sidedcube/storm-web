var ListItemView = require('./list-item-view'),
    getImageUrl = require('../helpers/getImageUrl');

module.exports = ListItemView.extend({
  initialize: function() {
    ListItemView.prototype.initialize.apply(this, arguments);
    this.currentFrame = -1;
  },

  afterRender: function() {
    ListItemView.prototype.afterRender.apply(this, arguments);
    this.nextFrame();

    // Preload all images.
    var background = this.model.get('images').map(function(image) {
      return 'url(' + getImageUrl(image) + ')';
    });

    this.$el.attr('style', 'background:' + background.join(',') + ';');
  },

  nextFrame: function() {
    var images = this.model.get('images');

    if (++this.currentFrame === images.length) {
      this.currentFrame = 0;
    }

    var image = images[this.currentFrame];

    if (!image) {
      return;
    }

    this.$('.carousel-item').hide();

    var delay = image.delay;

    if (delay < 100) {
      delay = 100;
    }

    this.$('.carousel-item').eq(this.currentFrame).show();
    this.animationTimer = setTimeout(this.nextFrame.bind(this), delay);
  },

  beforeDestroy: function() {
    clearTimeout(this.animationTimer);
  }
});

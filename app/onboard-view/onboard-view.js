require('./onboard.less');

module.exports = Backbone.View.extend({
  template: require('./onboard-view-template'),
  className: 'onboard',

  events: {
    'click .ok-button': 'okButtonClick'
  },

  /**
   * Handles clicks to the "OK" button. Closes the view.
   */
  okButtonClick: function() {
    this.destroy();
  }
});

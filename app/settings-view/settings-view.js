require('./settings-view.less');

module.exports = Backbone.View.extend({
  template: require('./settings-view-template'),
  className: 'settings-view',

  /** @override */
  afterRender: function() {
    this.trigger('ready');
  }
});

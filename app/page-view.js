var Page = require('./page');

module.exports = Backbone.View.extend({
  initialize: function(options) {
    options = options || {};

    this.id = options.url;
    this.listViews = [];

    if (!this.model && options.pageId) {
      this.model = new Page({id: options.pageId});
      this.model.once('sync', this.ready, this);
      this.model.fetch();
    }

    if (this.model) {
      this.pageId = this.model.id;
    }

    this.afterInitialize();
  },

  render: function() {
    Backbone.View.prototype.render.apply(this, arguments);

    if (this.pageId) {
      this.$el.addClass('page-' + this.pageId);
    }
  },

  ready: function() {
    this.trigger('ready');
    this.render();
  }
});

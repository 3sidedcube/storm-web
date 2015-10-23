var MorePageView = Backbone.View.extend({
  template: require('./more-page-view-template'),

  initialize: function() {
    this.id = 'app://more';
    this.model = new Backbone.Model({
      title: {
        content: {
          en: 'More'
        }
      }
    });
  },

  getRenderData: function() {
    return {tabs: MorePageView.tabs};
  },

  afterRender: function() {
    this.trigger('ready');
  }
});

MorePageView.tabs = [];

module.exports = MorePageView;

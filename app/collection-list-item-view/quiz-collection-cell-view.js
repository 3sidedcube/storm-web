var Page = require('../page');

require('./quiz-collection-cell-view.less');

module.exports = Backbone.View.extend({
  template: require('./quiz-collection-cell-view-template'),
  className: 'QuizCollectionCell clickable',

  initialize: function() {
    var badgeId = this.model.get('badgeId');

    if (App.data.badges) {
      this.badge = App.data.badges.get(badgeId);
    }

    if (!this.badge) {
      this.badge = new Page({id: badgeId});
      this.badge.once('sync', this.render, this);
      this.badge.fetch();
    }

    var url    = this.model.get('quiz').destination,
        quizId = App.utils.getIdFromCacheUrl(url);

    this.quizPage = new Page({id: quizId});
    this.quizPage.once('sync', this.render, this);
    this.quizPage.fetch();
  },

  getRenderData: function() {
    var data = this.model.toJSON();

    data.badge = this.badge.toJSON();
    data.quizPage = this.quizPage.toJSON();
    return data;
  },

  afterRender: function() {
    this.$el.attr('data-uri', this.model.get('quiz').destination);
  }
});

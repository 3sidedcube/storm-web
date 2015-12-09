require('./settings-view.less');

var QuizUtils = require('../quiz-page/quiz-utils');

module.exports = Backbone.View.extend({
  template: require('./settings-view-template'),
  className: 'settings-view',

  events: {
    'click .reset-button': 'resetQuizzesButtonClick'
  },

  /** @override */
  afterRender: function() {
    this.trigger('ready');
  },

  /**
   * Handles click events to the reset quizzes button, clears all badges.
   */
  resetQuizzesButtonClick: function() {
    QuizUtils.clearCompleteQuizzes();
  }
});

var ListItemView = require('./list-item-view'),
    QuizUtils    = require('../quiz-page/quiz-utils');

module.exports = ListItemView.extend({
  /** @override */
  template: require('./quiz-progress-list-item-view-template'),

  /** @override */
  getRenderData: function() {
    var quizzes = this.model.get('quizzes'),
        total   = quizzes.length;

    var completed = quizzes.reduce(function(prev, current) {
      var id = App.utils.getIdFromCacheUrl(current);

      return prev + (QuizUtils.isQuizComplete(id) ? 1 : 0);
    }, 0);

    return {
      completed: completed,
      total: total
    };
  }
});

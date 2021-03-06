var QuizQuestion = require('./quiz-question-view');

module.exports = QuizQuestion.extend({
  template: require('./image-slider-selection-question-view-template'),
  className: 'ImageSliderSelectionQuestion',

  events: {
    'input .slider input': 'inputChange'
  },

  inputChange: function(e) {
    this.$('.count').text(e.currentTarget.value);
  },

  isCorrect: function() {
    return +this.$('.slider input').val() === this.model.get('answer');
  }
});

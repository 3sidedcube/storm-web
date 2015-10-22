var QuizQuestion = require('./quiz-question-view'),
    localise     = require('../helpers/l');

module.exports = QuizQuestion.extend({
  template: require('./category-selection-question-view-template'),
  className: 'CategorySelectionQuestion',

  afterRender: function() {
    QuizQuestion.prototype.afterRender.apply(this, arguments);

    var html     = '',
        catCount = this.model.get('categories').length;

    this.model.get('options').forEach(function(option, i) {
      var options = '<td>' + localise(option) + '</td>';

      for (var j = 0; j < catCount; j++) {
        options += '<td><input type="radio" name="category-' + this.id + '-' + i + '"></td>';
      }

      html += '<tr>' + options + '</tr>';
    }, this);

    this.$('.category-grid tbody').html(html);
  },

  isCorrect: function() {
    var catCount = this.model.get('categories').length,
        answer   = this.model.get('answer'),
        selected = [];

    for (var option = 0; option < catCount; option++) {
      selected[option] = -1;

      this.$('input[name="category-' + this.id + '-' + option + '"]').each(function(i) {
        if ($(this).is(':checked')) {
          selected[option] = i;
        }
      });
    }

    // Check array values are the same.
    if (answer.length !== selected.length) {
      return false;
    }

    for (var i in answer) {
      if (answer[i] !== selected[i]) {
        return false;
      }
    }

    return true;
  }
});

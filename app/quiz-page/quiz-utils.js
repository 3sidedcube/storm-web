/** Set of utility functions for dealing with quiz pages. */
module.exports = {
  /**
   * Checks whether the quiz with the specified {@param id} has been previously
   * completed.
   * @param {string} id The ID of the quiz page to check.
   * @returns {boolean} Whether the quiz has previously been completed.
   */
  isQuizComplete: function(id) {
    return localStorage.getItem('quiz-' + id) !== null;
  },

  /**
   * Sets the quiz with the specified {@param id} as completed. Value will be
   * persisted between app loads.
   * @param {string} id The ID of the quiz page to mark as completed.
   */
  setQuizComplete: function(id) {
    localStorage.setItem('quiz-' + id, '1');
    App.view.trigger('quiz-complete');
  },

  /**
   * Clears all completed quizzes and resets achievements.
   */
  clearCompleteQuizzes: function() {
    var keys = [];

    for (var i = 0; i < localStorage.length; i++) {
      var key = localStorage.key(i);

      if (/^quiz-.*$/.test(key)) {
        keys.push(key);
      }
    }

    keys.forEach(function(k) {
      localStorage.removeItem(k);
    });

    App.view.trigger('quiz-complete');

    alert('Achievements cleared');
  }
};

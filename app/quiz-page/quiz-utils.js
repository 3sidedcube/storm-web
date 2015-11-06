/** Set of utility functions for dealing with quiz pages. */
module.exports = {
  /**
   * Checks whether the quiz with the specified {@param id} has been previously
   * completed.
   * @param id The ID of the quiz page to check.
   * @returns {boolean} Whether the quiz has previously been completed.
   */
  isQuizComplete: function(id) {
    return localStorage.getItem('quiz-' + id) !== null;
  }
};

var QuizQuestion = require('./quiz-question-view')

module.exports = QuizQuestion.extend({
	template: require('./category-selection-question-view-template'),
	className: 'CategorySelectionQuestion'
})

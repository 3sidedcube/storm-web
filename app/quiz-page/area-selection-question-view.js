var QuizQuestion = require('./quiz-question-view')

module.exports = QuizQuestion.extend({
	template: require('./area-selection-question-view-template'),
	className: 'AreaSelectionQuestion'
})

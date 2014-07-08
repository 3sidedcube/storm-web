var QuizQuestion = require('./quiz-question-view')

module.exports = QuizQuestion.extend({
	template: require('./slider-selection-question-view-template'),
	className: 'SliderSelectionQuestion'
})

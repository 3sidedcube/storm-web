var QuizQuestion = require('./quiz-question-view')

module.exports = QuizQuestion.extend({
	template: require('./image-slider-selection-question-view-template'),
	className: 'ImageSliderSelectionQuestion'
})

var QuizQuestion = require('./quiz-question-view')

module.exports = QuizQuestion.extend({
	template: require('./image-selection-question-view-template'),
	className: 'ImageSelectionQuestion',

	getRenderData: function() {
		var data = this.model.toJSON()

		for (var i in data.options) {
			data.options[i].image = data.images[i]
		}

		return data
	}
})

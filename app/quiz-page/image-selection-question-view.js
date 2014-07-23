var QuizQuestion = require('./quiz-question-view')

module.exports = QuizQuestion.extend({
	template: require('./image-selection-question-view-template'),
	className: 'ImageSelectionQuestion',

	events: {
		'click .image-selection-option': 'optionClick'
	},

	getRenderData: function() {
		var data = this.model.toJSON()

		for (var i in data.options) {
			data.options[i].image = data.images[i]
		}

		return data
	},

	optionClick: function(e) {
		$(e.currentTarget).toggleClass('active')

		var checkedCount = this.$('.image-selection-option.active').length

		if (checkedCount > this.model.get('limit')) {
			this.lastOptionSelected.classList.remove('active')
		}

		if (e.currentTarget.classList.contains('active')) {
			this.lastOptionSelected = e.currentTarget
		}
	}
})

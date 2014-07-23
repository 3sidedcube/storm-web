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
	},

	isCorrect: function() {
		var answer = this.model.get('answer')

		var selected = this.$('.image-selection-option.active').map(function() {
			return +$(this).data('index')
		}).get()

		if (answer.length !== selected.length) {
			return false
		}

		for (var i in answer) {
			if (answer[i] !== selected[i]) {
				return false
			}
		}

		return true
	}
})

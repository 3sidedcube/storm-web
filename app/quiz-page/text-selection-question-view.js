var QuizQuestion = require('./quiz-question-view')

module.exports = QuizQuestion.extend({
	template: require('./text-selection-question-view-template'),
	className: 'TextSelectionQuestion',

	events: {
		'change .CheckableListItemView input': 'inputChange'
	},

	initialize: function() {
		this.lastOptionSelected = null
	},

	inputChange: function(e) {
		var checkedCount = this.$('.CheckableListItemView input:checked').length

		if (checkedCount > this.model.get('limit')) {
			this.lastOptionSelected.checked = false
		}

		if (e.currentTarget.checked) {
			this.lastOptionSelected = e.currentTarget
		}
	}
})

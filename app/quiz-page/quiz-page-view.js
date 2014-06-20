var NavigationController = require('navigation-controller')

module.exports = NavigationController.extend({
	template: require('./quiz-page-view-template'),
	className: 'QuizPage',

	ready: function() {
		this.render()

		// Load first question.
		var pages = this.model.get('children')

		if (!pages) {
			return
		}

		var startPage = pages[0].src
		this.setPage(startPage, true)
	},
})

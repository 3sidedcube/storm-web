var NavigationController = require('navigation-controller'),
	QuizQuestionViewBuilder = require('quiz-page/quiz-question-view-builder')

module.exports = NavigationController.extend({
	template: require('./quiz-page-view-template'),
	className: 'QuizPage',

	events: {
		'click .quiz-next-button': 'nextQuestion',
		'click .quiz-back-button': 'prevQuestion',

		'touchstart .quiz-next-button, .quiz-back-button': 'buttonTouchStart',
		'touchend .quiz-next-button, .quiz-back-button': 'buttonTouchEnd',
		'touchcancel .quiz-next-button, .quiz-back-button': 'buttonTouchEnd'
	},

	ready: function() {
		this.render()

		this.trigger('ready')

		// Load first question.
		var pages = this.model.get('children')

		if (!pages) {
			return
		}

		this.currentQuestion = 0
		this.setPage(0, true)
	},

	buildView: function(id) {
		var questions = this.model.get('children'),
			model = new Backbone.Model(questions[id]),
			view = QuizQuestionViewBuilder.build(model)

		view.id = id

		return view
	},

	setPageTitle: function() {
		this.$('> .header .progress-text').text((this.currentQuestion + 1) + ' ' + App.language.get('_QUIZ_OF') + ' ' + this.model.get('children').length)

		// Set progress bar value and caption.
		var questions = this.model.get('children')
		this.$('.header progress').attr('max', questions.length).attr('value', this.currentQuestion + 1)
	},

	nextQuestion: function() {
		var questions = this.model.get('children')

		if (++this.currentQuestion < questions.length) {
			this.setPage(this.currentQuestion)
		} else {
			// TODO finish quiz
		}
	},

	prevQuestion: function() {
		if (--this.currentQuestion >= 0) {
			this.setPage(this.currentQuestion)
		} else {
			history.go(-1)
		}
	},

	buttonTouchStart: function(e) {
		$(e.currentTarget).addClass('glow')
	},

	buttonTouchEnd: function(e) {
		$(e.currentTarget).removeClass('glow')
	},

	beforeDestroy: function() {
		// Clean up all child views.
		this.viewStack.forEach(function(view) {
			view.destroy()
		})

		this.viewStack = []
	}
})

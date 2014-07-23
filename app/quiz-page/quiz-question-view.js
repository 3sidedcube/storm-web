module.exports = Backbone.View.extend({
	afterRender: function() {
		this.$el.addClass('QuizQuestion')
		this.trigger('ready')
	},

	isCorrect: function() {
		// Should be overridden in all implementations.
		return false
	}
})

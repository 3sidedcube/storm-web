module.exports = Backbone.View.extend({
	afterRender: function() {
		this.$el.addClass('QuizQuestion')
		this.trigger('ready')
	}
})

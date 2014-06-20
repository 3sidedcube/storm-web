module.exports = Backbone.View.extend({
	template: require('./list-item-view-template'),
	className: 'ListItem',

	afterRender: function() {
		this.$el.addClass(this.model.get('class'))

		if (this.model.has('link')) {
			this.$el.attr('data-uri', this.model.get('link').destination)
			this.$el.addClass('clickable')
		}
	}
})

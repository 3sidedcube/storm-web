module.exports = Backbone.View.extend({
	template: require('./list-item-view-template'),
	className: 'ListItem',

	events: {
		'change input': 'inputChange'
	},

	afterRender: function() {
		this.$el.addClass(this.model.get('class'))

		if (this.model.has('link')) {
			this.$el.attr('data-uri', this.model.get('link').destination)
			this.$el.attr('data-link-type', this.model.get('link')['class'])
			this.$el.addClass('clickable')
		}

		if (this.model.get('class') === 'CheckableListItemView') {
			this.$el.prepend('<input type="checkbox">')

			var checkState = localStorage.getItem('check-' + this.model.id) === 'true'
			this.$('input')[0].checked = checkState
		}
	},

	inputChange: function(e) {
		if (this.model.get('class') === 'CheckableListItemView' && !this.model.get('volatile')) {
			localStorage.setItem('check-' + this.model.id, e.currentTarget.checked)
		}
	}
})

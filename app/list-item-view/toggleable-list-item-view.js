var ListItemView = require('list-item-view/list-item-view')

module.exports = ListItemView.extend({
	events: {
		'click': 'click'
	},

	afterRender: function() {
		ListItemView.prototype.afterRender.apply(this, arguments)
		this.$el.addClass('toggled')
	},

	click: function() {
		this.$el.toggleClass('toggled')
	}
})

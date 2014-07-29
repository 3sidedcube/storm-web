var ListItemView = require('list-item-view/list-item-view')

module.exports = ListItemView.extend({
	events: {
		'click': 'click'
	},

	click: function() {
		this.$el.toggleClass('toggled')
	}
})

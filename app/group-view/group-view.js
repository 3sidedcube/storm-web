var ListItemViewBuilder = require('../list-item-view/list-item-view-builder')

module.exports = Backbone.View.extend({
	template: require('./group-view-template'),
	className: 'GroupView',

	initialize: function() {
		this.listViews = []
	},

	afterRender: function() {
		this.listViews.forEach(function(view) {
			view.destroy()
		})

		this.listViews = []

		this.model.get('children').forEach(function(child) {
			var view = ListItemViewBuilder.build(child)
			this.listViews.push(view)
			this.$('> .children').append(view.render().el)
		}, this)
	}
})

var PageView = require('../page-view'),
	GroupView = require('../group-view/group-view')

module.exports = PageView.extend({
	template: require('./list-page-view-template'),

	afterRender: function() {
		this.listViews.forEach(function(view) {
			view.destroy()
		})

		this.listViews = []

		var children = this.model.get('children')

		for (var i in children) {
			var child = children[i],
				view = new GroupView({model: new Backbone.Model(child)})

			this.listViews.push(view)
			this.$('> .children').append(view.render().el)
		}

		// Add any extra style classes.
		var attrs = this.model.get('attributes') || []

		attrs.forEach(function(attr) {
			if (attr.indexOf('STYLE_') > -1) {
				this.$el.addClass(attr.toLowerCase())
			}
		}, this)
	}
})

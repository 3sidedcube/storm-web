var ListItemView = require('list-item-view/list-item-view')

var ViewTypes = {}

module.exports = {
	build: function(child) {
		var View = ViewTypes[child['class']] || ListItemView,
			model = new Backbone.Model(child)

		return new View({model: model})
	}
}

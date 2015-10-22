var ListItemView = require('./list-item-view')

var ViewTypes = {
	CollectionListItemView: require('../collection-list-item-view/collection-list-item-view'),
	ToggleableListItemView: require('./toggleable-list-item-view'),
	SpotlightImageListItemView: require('./spotlight-image-list-item-view'),
	AnimatedImageListItemView: require('./animated-image-list-item-view'),
	MultiVideoListItemView: require('./multi-video-list-item-view')
}

module.exports = {
	build: function(child) {
		var View = ViewTypes[child['class']] || ListItemView,
			model = new Backbone.Model(child)

		return new View({model: model})
	}
}

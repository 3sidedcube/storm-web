var NavigationController = require('navigation-controller')

module.exports = NavigationController.extend({
	template: require('./root-navigation-controller-template'),
	el: '#container',

	events: {
		'click .clickable': 'linkClick'
	},

	initialize: function() {
		NavigationController.prototype.initialize.apply(this, arguments)
		this.render()
	},

	setPageTitle: function() {},

	linkClick: function(e) {
		var uri = $(e.currentTarget).data('uri')

		this.setPage(uri, false)
		App.router.navigate(uri)

		e.stopPropagation()
	}
})

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
		var uri = $(e.currentTarget).data('uri'),
			linkType = $(e.currentTarget).data('link-type')

		if (linkType === 'ExternalLink') {
			// Open URL in internal browser.
			var oldUri = this.currentView.id
			this.setPage('app://browser', false)
			this.currentView.setUri(uri)
			this.currentView.setBackTarget(oldUri)
		} else if (linkType === 'UriLink') {
			// Open URL in external browser.
			window.open(uri, '_blank')
		} else if (linkType === 'ShareLink') {
			// TODO share functionality
		} else {
			this.setPage(uri, false)
			App.router.navigate(uri)
		}

		e.stopPropagation()
	}
})

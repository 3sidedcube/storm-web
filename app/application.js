var StormApp = require('storm-app'),
	StormManifest = require('storm-manifest'),
	Router = require('router'),
	RootNavigationController = require('root-navigation-controller')

module.exports = {
	init: function() {
		this.setImageDensity()

		this.router   = new Router()
		this.app      = new StormApp()
		this.manifest = new StormManifest()

		this.view     = new RootNavigationController()

		var appFetch = this.app.fetch(),
			manifestFetch = this.manifest.fetch()

		return $.when(appFetch, manifestFetch)
	},

	setImageDensity: function() {
		if (window.devicePixelRatio <= 0.75) {
			this.imageDensity = 0.75
		} else if (window.devicePixelRatio <= 1) {
			this.imageDensity = 1
		} else if (window.devicePixelRatio <= 1.5) {
			this.imageDensity = 1.5
		} else {
			this.imageDensity = 2
		}
	},

	view: null,
	app: null,
	manifest: null,
	data: {},
	imageDensity: 1,
	mode: 0,
	utils: require('utils'),

	APP_MODE_FULL: 0,
	APP_MODE_PAGE: 1
}

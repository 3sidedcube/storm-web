module.exports = Backbone.Router.extend({
	routes: {
		''        : 'home',
		'*nomatch': 'page'
	},

	home: function() {
		var rootPage = App.app.get('vector')
		this.page(rootPage)
	},

	page: function(url) {
		// Don't push content pages onto the root controller in full app mode.
		if (App.mode === App.APP_MODE_FULL && App.target === App.APP_TARGET_LOCAL) {
			var page = App.app.map[url]

			if (page.type === 'ListPage') {
				if (!App.view.currentView || App.view.currentView.url !== App.app.get('vector')) {
					this.home()

					App.view.once('ready', function() {
						App.view.currentView.setPage(url)
					})
				} else {
					App.view.currentView.setPage(url)
				}

				return
			}
		}

		App.view.setPage(url)
	}
})

function setView(view) {
	if (App.view) {
		App.view.destroy()
	}

	App.view = view
}

var PageViewBuilder = require('page-view-builder')

module.exports = Backbone.Router.extend({
	routes: {
		'*nomatch'   : 'page'
	},

	page: function(url) {
		if (App.view) {
			App.view.setPage('cache://' + url)
		} else {
			var rootPage = App.app.get('vector')
			setView(PageViewBuilder.build(rootPage))

			if (url) {
				App.view.startUrl = 'cache://' + url
			}
		}
	}
})

function setView(view) {
	if (App.view) {
		App.view.destroy()
	}

	App.view = view

	$('#container').html(view.render().el)
}

var PageTypes = {
	'ListPage': require('list-page/list-page-view'),
	'TabbedPageCollection': require('tabbed-page-collection/tabbed-page-collection-view'),
	'QuizPage': require('quiz-page/quiz-page-view')
}

module.exports = {
	build: function(url) {
		if (url.substr(0, 6) === 'app://') {
			return new Backbone.View

			// TODO native page stuff
		}

		var pageDescriptor = App.app.map[url],
			type = pageDescriptor.type

		var Page = PageTypes[type],
			id = App.utils.getIdFromCacheUrl(url)

		return new Page({
			id: id,
			url: url
		})
	}
}

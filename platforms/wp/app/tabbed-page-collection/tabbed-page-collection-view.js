var NavigationController = require('navigation-controller')

module.exports = NavigationController.extend({
	template: require('./tabbed-page-collection-view-template'),
	className: 'wp-TabbedPageCollection',

	initialize: function() {
		NavigationController.prototype.initialize.apply(this, arguments)

		this.listViews = []

		var data = [];
		for (var i = 0; i < 100; i++) {
			data.push({ author: 'Adam Smith', titleColor: 'rgba(212, 14, 136, 1)', title: 'Missed conversation with Michael Brown', previewText: 'Michael Brown [1:53 PM]: Thanks for taking the time...', time: '1:55p' });
			data.push({ author: 'Michael Brown', titleColor: 'rgba(212, 14, 136, 1)', title: 'Need help later', previewText: 'I was hoping you could help me with...', time: '1:50p' });
			data.push({ author: 'Thomas Lee', titleColor: 'rgba(212, 14, 136, 1)', title: 'Lunch with you', previewText: 'Any chance you want to do lunch on...', time: '1:20p' });
			data.push({ author: 'Michael Wilson', titleColor: 'rgba(212, 14, 136, 1)', title: 'QuickStart\'s and How To\'s', previewText: 'More information on how to use WinJS controls', time: '1:17p' });
			data.push({ author: 'Gary Paul', titleColor: 'rgba(212, 14, 136, 1)', title: 'Going out saturday', previewText: 'Jean and I are leaving...', time: '12:28p' });
			data.push({ author: 'Smith Jones', titleColor: 'rgba(212, 14, 136, 1)', title: 'Happend every time', previewText: 'I always end up going to the ...', time: '7:12a' });
		}
		window.All = { dataSource: new WinJS.Binding.List(data).dataSource };


		data = [];
		data.push({ author: 'Michael Wilson', titleColor: 'rgba(212, 14, 136, 1)', title: 'QuickStart\'s and How To\'s', previewText: 'More information on how to use WinJS controls', time: '1:17p' });
		data.push({ author: 'Gary Paul', titleColor: 'rgba(212, 14, 136, 1)', title: 'Going out saturday', previewText: 'Jean and I are leaving...', time: '12:28p' });
		data.push({ author: 'Smith Jones', titleColor: 'rgba(212, 14, 136, 1)', title: 'Happend every time', previewText: 'I always end up going to the ...', time: '7:12a' });
		data.push({ author: 'Michael Wilson', titleColor: 'rgba(212, 14, 136, 1)', title: 'QuickStart\'s and How To\'s', previewText: 'More information on how to use...', time: '1:17p' });
		window.Unread = { dataSource: new WinJS.Binding.List(data).dataSource };

		data = [];
		data.push({ author: 'Michael Wilson', titleColor: 'rgba(212, 14, 136, 1)', title: 'QuickStart\'s and How To\'s', previewText: 'More information on how to use...', time: '1:17p' });
		data.push({ author: 'Smith Jones', titleColor: 'rgba(212, 14, 136, 1)', title: 'AppBar and ListView integration', previewText: 'Contextual commands in the AppBar', time: '7:12a' });
		window.Flagged = { dataSource: new WinJS.Binding.List(data).dataSource };

		data = [];
		data.push({ author: 'Michael Wilson', titleColor: 'rgba(212, 14, 136, 1)', title: 'QuickStart\'s and How To\'s', previewText: 'More information on how to use WinJS controls', time: '1:17p' });
		data.push({ author: 'Gary Paul', titleColor: 'rgba(212, 14, 136, 1)', title: 'Going out saturday', previewText: 'Jean and I are leaving...', time: '12:28p' });
		data.push({ author: 'Smith Jones', titleColor: 'rgba(212, 14, 136, 1)', title: 'Happend every time', previewText: 'I always end up going to the ...', time: '7:12a' });
		window.Urgent = { dataSource: new WinJS.Binding.List(data).dataSource };
	},

	getRenderData: function() {
		var data = this.model.toJSON(),
			tabs = data.pages || []

		if (tabs.length > 5) {
			this.moreTabs = tabs.splice(4, tabs.length - 4)
		}

		tabs.push({
			src: 'app://more',
			tabBarItem: {
				title: {
					content: 'cik0t'
				},
				image: {
					'class': 'Image',
					src: {
						x1: '',
						x2: ''
					}
				}
			}
		})

		return data
	},

	afterRender: function() {
		var PageViewBuilder = require('page-view-builder'),
			self = this

		// Render out all main tab pages.
		this.$('.page-container').each(function() {
			var url = $(this).data('src'),
				view = PageViewBuilder.build(url)

			self.listViews.push(view)

			$(this).html(view.render().el)
		})

		setTimeout(function() {
			WinJS.UI.processAll()
		})
	}
})

var MAX_TABS = 5

var NavigationController = require('navigation-controller'),
	MorePage = require('more-page')

module.exports = NavigationController.extend({
	template: require('./tabbed-page-collection-view-template'),
	className: 'TabbedPageCollection',

	events: {
		'click .clickable': 'linkClick'
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

	ready: function() {
		this.render()

		if (!this.startUrl) {
			// Find start page.
			var pages = this.model.get('pages'),
				startPage = pages[0].src

			for (var i in pages) {
				if (pages[i].startPage) {
					startPage = pages[i].src
					break
				}
			}

			this.setPage(startPage, true)
			App.router.navigate(startPage, {replace: true})

			// Set tab active state.
			this.$('.TabBarItem[data-uri=\'' + startPage + '\']').addClass('active')
		} else {
			this.setPage(this.startUrl)
		}

		this.trigger('ready')
	},

	// TODO override for more page

	// setPage: function(url, newStack) {
	// 	if (url === 'cache://more') {
	// 		newView = new MorePage({pages: this.moreTabs})
	// 		newView.render()
	// 	} else
	// },

	linkClick: function(e) {
		var uri = $(e.currentTarget).data('uri'),
			newStack = $(e.currentTarget).data('clear-stack')

		// Check if we need to push this view onto the root nav controller.
		if (App.app.map[uri].type === 'QuizPage') {
			return
		}

		this.setPage(uri, newStack)
		App.router.navigate(uri)

		if (e.currentTarget.classList.contains('TabBarItem')) {
			$('.TabBarItem.active').removeClass('active')
			$(e.currentTarget).addClass('active')
		}

		e.stopPropagation()
	},

	setPageTitle: function() {
		var title = Handlebars.helpers.l(this.currentView.model.get('title'))
		this.$('> .header span').text(title)
	}
})

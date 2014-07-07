var PageView = require('page-view')

module.exports = PageView.extend({
	initialize: function() {
		PageView.prototype.initialize.apply(this, arguments)
		this.viewStack = []
		this.currentView = null
	},

	afterRender: function() {
		this.pageContent = this.$('> .page-content')
		this.newPageContent = this.$('> .new-page-content')
	},

	setPage: function(id, newStack) {
		var oldView = this.currentView,
			newView,
			transitionClass

		// Don't navigate to the current view.
		if (oldView && id === oldView.id) {
			return
		}

		if (newStack) {
			this.viewStack.forEach(function(view) {
				view.destroy()
			})

			this.viewStack = []
		}

		// Check if the view we want is on top of the stack.
		var lastView = this.viewStack[this.viewStack.length - 1],
			rerender = false

		if (lastView && lastView.id === id) {
			this.viewStack.splice(this.viewStack.length - 1, 1)
			this.setPageTitle()

			newView = lastView
			transitionClass = 'slide-right'

			oldView = null
		} else {
			newView = this.buildView(id)
			rerender = true

			transitionClass = 'slide-left'
		}

		if (newStack) {
			transitionClass = 'scale'
		}

		if (newStack || this.viewStack.length === 0 && newView === lastView) {
			this.$('.back-button').hide()
		} else {
			this.$('.back-button').show()
		}

		this.newPageContent.html(newView.el)

		newView.once('ready', function() {
			var self = this

			this.currentView = newView
			this.setPageTitle()

			this.pageContent.addClass(transitionClass)
			this.newPageContent.addClass(transitionClass)

			this.pageContent.on('animationend, webkitAnimationEnd', function() {
				self.pageContent.toggleClass('page-content new-page-content').removeClass(transitionClass)
				self.newPageContent.toggleClass('page-content new-page-content').removeClass(transitionClass)

				var temp = self.pageContent
				self.pageContent = self.newPageContent
				self.newPageContent = temp

				if (oldView && !newStack) {
					self.viewStack.push(oldView)
				} else {
					self.pageContent.find('.focus').removeClass('focus')

					if (oldView) {
						oldView.destroy()
					}
				}

				$(this).off('animationend, webkitAnimationEnd')
			})
		}, this)

		if (rerender) {
			newView.render()
		}

		if (lastView && lastView.id === id) {
			newView.trigger('ready')
		}
	},

	buildView: function(url) {
		var PageViewBuilder = require('page-view-builder')
		return PageViewBuilder.build(url.substr(8))
	},

	destroy: function() {
		PageView.prototype.destroy.call(this)

		this.viewStack.forEach(function(view) {
			view.destroy()
		})
	}
})

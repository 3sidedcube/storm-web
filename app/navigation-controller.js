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
		console.info('Pushing to view ID', id)

		// Stop any animations still running.
		var classes = ['slide-left', 'slide-right', 'scale']

		for (var i = 0; i < this.pageContent[0].classList.length; i++) {
			var className = this.pageContent[0].classList[i]

			if (classes.indexOf(className) > -1) {
				this.pageContent.trigger('animationend')
				break
			}
		}

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
			console.info('Pushing back to last view')

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
			console.info('View ready')

			var self = this

			this.currentView = newView
			this.setPageTitle()

			this.pageContent.addClass(transitionClass)
			this.newPageContent.addClass(transitionClass)

			this.pageContent.one('animationend webkitAnimationEnd', function() {
				// Don't do anything if we've already navigated away from this view.
				if (newView.id !== self.currentView.id) {
					return
				}

				self.pageContent.toggleClass('page-content new-page-content').removeClass(transitionClass)
				self.newPageContent.toggleClass('page-content new-page-content').removeClass(transitionClass)

				var temp = self.pageContent
				self.pageContent = self.newPageContent
				self.newPageContent = temp

				if (oldView && !newStack) {
					self.viewStack.push(oldView)
				} else {
					if (oldView) {
						oldView.destroy()
					}
				}
			})

			setTimeout(function() {
				self.newPageContent.find('.focus').removeClass('focus')
			}, 600)
		}, this)

		if (rerender) {
			newView.render()
		}

		// If we've popped the last view off the stack it's already ready.
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

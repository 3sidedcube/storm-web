var PageView = require('page-view')

module.exports = PageView.extend({
	initialize: function() {
		PageView.prototype.initialize.apply(this, arguments)
		this.viewStack = []
	},

	afterRender: function() {
		this.pageContent = this.$('> .page-content')
		this.newPageContent = this.$('> .new-page-content')
	},

	setPage: function(url, newStack) {
		var oldView = this.pageView,
			newView,
			transitionClass

		// Don't navigate to the current view.
		if (oldView && url === oldView.url) {
			return
		}

		if (newStack) {
			this.viewStack.forEach(function(view) {
				view.destroy()
			})

			this.viewStack = []
		}

		// Check if the view we want is on top of the stack.
		var lastView = this.viewStack[this.viewStack.length - 1]

		if (lastView && lastView.url === url) {
			this.viewStack.splice(this.viewStack.length - 1, 1)
			this.setPageTitle()

			newView = lastView
			transitionClass = 'slide-right'

			oldView = null
		} else {
			PageViewBuilder = require('page-view-builder')

			newView = PageViewBuilder.build(url.substr(8))
			newView.render()

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

		newView.model.once('sync', function() {
			var self = this

			this.pageView = newView
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
				}

				$(this).off('animationend, webkitAnimationEnd')
			})
		}, this)

		if (lastView && lastView.url === url) {
			newView.model.trigger('sync')
		}
	},

	destroy: function() {
		PageView.prototype.destroy.call(this)

		this.viewStack.forEach(function(view) {
			view.destroy()
		})
	}
})

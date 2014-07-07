var Page = require('page')

module.exports = Backbone.View.extend({
	initialize: function(options) {
		this.id = options.url

		this.listViews = []

		this.model = new Page({id: options.id})
		this.model.once('sync', this.ready, this)
		this.model.fetch()

		this.afterInitialize()
	},

	ready: function() {
		this.trigger('ready')
		this.render()
	}
})

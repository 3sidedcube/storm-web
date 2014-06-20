module.exports = Backbone.Model.extend({
	url: 'bundle/app.json',

	generateMap: function() {
		this.map = {}

		var pages = this.get('map')

		for (var i = 0; i < pages.length; i++) {
			this.map[pages[i].src] = pages[i]
		}
	}
})

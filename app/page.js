module.exports = Backbone.Model.extend({
	url: function() {
		return 'bundle/pages/' + this.id + '.json'
	}
})

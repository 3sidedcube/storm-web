module.exports = Backbone.Model.extend({
	url: function() {
		if (App.target === App.APP_TARGET_LOCAL) {
			return 'bundle/pages/' + this.id + '.json'
		} else {
			return App.apiRoot + 'objects/' + this.id + '/stream'
		}
	}
})

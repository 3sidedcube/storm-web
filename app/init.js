var StormLanguage = require('storm-language')

require('helpers')

window.App = require('application')

$(document).ready(function() {
	FastClick.attach(document.body)
	App.init().then(fetchLanguage)

	$(document).on('touchstart', '.clickable', function(e) {
		$(e.currentTarget).addClass('focus')
	})

	$(document).on('touchmove touchcancel', '.clickable', function(e) {
		$(e.currentTarget).removeClass('focus')
	})
})

function fetchLanguage() {
	App.app.generateMap()
	App.manifest.generateMap()

	// Load in the closest language to what the browser wants.
	var lang = navigator.language.substr(0, 2)

	if (!App.manifest.map[lang]) {
		lang = Object.keys(App.manifest.map)[0]
	}

	App.language = new StormLanguage({lang: App.manifest.map[lang]})
	App.language.once('sync', startApp)
	App.language.fetch()
}

function startApp() {
	Backbone.history.start({
		pushState: false
	})
}

Backbone.View.prototype.afterInitialize = function() {}

Backbone.View.prototype.template = function() {}

Backbone.View.prototype.getRenderData = function() {
	return (this.model) ? this.model.toJSON() : {}
}

Backbone.View.prototype.render = function(data) {
	// Render from template
	this.$el.html(this.template(this.getRenderData(), {data: data}))

	// Render all subviews
	_.each(this.views, function(view) {
		this.$el.append(view.render().el)
	}, this)

	this.afterRender()
	return this
}

Backbone.View.prototype.afterRender = function() {}

Backbone.View.prototype.beforeDestroy = function() {}

Backbone.View.prototype.destroy = function() {
	// Run any extra cleanup (saving etc)
	this.beforeDestroy()

	// Remove any child views first
	if (this.views) {
		this.views.forEach(function(view) {
			view.destroy()
		})
	}

	if (this.listViews) {
		this.listViews.forEach(function(view) {
			view.destroy()
		})
	}

	// Remove view
	this.remove()
	this.unbind()
}

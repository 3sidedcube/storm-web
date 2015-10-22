var StormLanguage = require('./storm-language'),
	StormData = require('./storm-data')

require('./main.less')
require('current-platform/platform-init')

window.App = require('./application')

$(document).ready(function() {
	App.init().then(appLoaded, appLoadError)

	$(document).on('click', '.CheckableListItemView', function(e) {
		var input = $(this).find('input')[0]
		input.checked = !input.checked
		$(input).trigger('change')

		this.classList.add('highlight')

		$(this).one('animationend webkitAnimationEnd', function() {
			this.classList.remove('highlight')
		})
	})

	// Revert state on checkbox click so that the parent event handler can update it.
	$(document).on('click', '.CheckableListItemView input', function(e) {
		this.checked = !this.checked
	})

	var isIOS = navigator.userAgent.match(/(iPod|iPhone|iPad)/) !== null

	if (isIOS || window.CSS && window.CSS.supports('(-webkit-mask-size: contain) or (mask-size: contain)')) {
		document.body.classList.add('mask-images')
	}
})

// Callback once app.json and manifest.json have loaded.
function appLoaded() {
	var lang = fetchLanguage(),
		data = fetchData()

	$.when(lang, data).then(startApp, appStartError)
}

function appLoadError() {
	console.error('Failed to load app or manifest JSON.')
}

// Load in a localisation JSON referenced in the manifest.
function fetchLanguage() {
	App.app.generateMap()
	App.manifest.generateMap()

	// Load in the closest language to what the browser wants.
	var lang = navigator.language.substr(0, 2)

	if (!App.manifest.map[lang]) {
		lang = Object.keys(App.manifest.map)[0]
	}

	if (lang) {
		App.language = new StormLanguage({lang: App.manifest.map[lang]})
		return App.language.fetch()
	}

	// No lang - running remotely.
	return $.when()
}

// Load in all JSON files referenced in the data section of the manifest.
function fetchData() {
	var requests = []

	var datasets = App.manifest.get('data') || []

	datasets.forEach(function(data) {
		var filename = data.src.slice(0, -5),
			model = new StormData()

		model.url = 'bundle/data/' + data.src

		App.data[filename] = model
		requests.push(model.fetch())
	})

	return $.when.apply($, requests)
}

// All data loaded in - begin navigation.
function startApp() {
	Backbone.history.start({
		pushState: false
	})
}

function appStartError() {
	console.error('Failed to load auxillary data from manifest.')
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

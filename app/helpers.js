Handlebars.registerHelper('l', function(key) {
	if (!key) {
		return
	}

	if (key.content) {
		key = key.content
	}

	var string

	if (typeof key === 'object') {
		// Streaming object.
		var lang = navigator.language.substr(0, 2)
		string = key[lang] || key[Object.keys(key)[0]]
	} else {
		// Local bundle.
		string = App.language.get(key)
	}

	if (string) {
		string = string.replace(/\n/g, '<br>')
	}

	return string
})

Handlebars.registerHelper('getImageUrl', function(image) {
	if (!image) {
		return
	}

	if (image['class'] === 'NativeImage') {
		// TODO
	} else {
		var cacheUrl = image.src['x' + App.imageDensity]
		return cacheUrl.replace('cache://', 'bundle/')
	}
})

// Sum up all arguments passed.
Handlebars.registerHelper('add', function() {
	var params = Array.prototype.slice.call(arguments, 0, arguments.length - 1)

	return params.reduce(function(a, b) {
		return a + b
	})
})

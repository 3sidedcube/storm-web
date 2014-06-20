Handlebars.registerHelper('l', function(key) {
	if (!key || !key.content) {
		return
	}

	var string = App.language.get(key.content)

	if (string) {
		string = string.replace(/\n/g, '<br>')
	}

	return string
})

Handlebars.registerHelper('getImageUrl', function(image) {
	if (image['class'] === 'NativeImage') {
		// TODO
	} else {
		var cacheUrl = image.src['x' + App.imageDensity]
		return cacheUrl.replace('cache://', 'bundle/')
	}
})

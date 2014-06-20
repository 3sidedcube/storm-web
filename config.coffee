exports.config =
	paths:
		public: 'public'

	files:
		javascripts:
			defaultExtension: 'js'
			joinTo:
				'javascripts/app.js': /^app/
				'javascripts/vendor.js': /^vendor/
			order:
				before: [
					'vendor/scripts/jquery-1.11.1.js'
					'vendor/scripts/underscore-1.4.4.js'
				]

		stylesheets:
			defaultExtension: 'less'
			joinTo: 'stylesheets/app.css'
			order:
				before: [
					'vendor/styles/normalize.css'
				]

		templates:
			defaultExtension: 'hbs'
			joinTo: 'javascripts/app.js'

	modules:
		addSourceURLs: yes

	imageoptimizer:
		smushit: false
		path: 'images'

	framework: 'backbone'

	server:
		run: yes

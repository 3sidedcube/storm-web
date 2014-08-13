platform = process.env.PLATFORM

appJs = new RegExp('^(app|platforms\/' + platform + '\/app)')
vendorJs = new RegExp('^(vendor|platforms\/' + platform + '\/vendor)')
css = new RegExp('^(app|vendor|platforms\/' + platform + '\/(app|vendor))')

exports.config =
	paths:
		public: 'public'
		watched: ['app', 'vendor', 'platforms']

	files:
		javascripts:
			defaultExtension: 'js'
			joinTo:
				'javascripts/app.js': appJs
				'javascripts/vendor.js': vendorJs
			order:
				before: [
					'vendor/scripts/jquery-1.11.1.js'
					'vendor/scripts/underscore-1.4.4.js'
				]
				after: /^platforms\/\w\/app/

		stylesheets:
			defaultExtension: 'less'
			joinTo: 'stylesheets/app.css': css
			order:
				before: [
					'vendor/styles/normalize.css'
				]

		templates:
			defaultExtension: 'hbs'
			joinTo: 'javascripts/app.js': appJs

	modules:
		nameCleaner: (path) ->
			path.replace(/^(platforms\/(\w+)\/)?app\//, '')

	plugins:
		imageoptimizer:
			smushit: false
			path: 'images'

	framework: 'backbone'

	server:
		run: yes

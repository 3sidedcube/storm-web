var ListPage = require('list-page/list-page-view'),
	Page = require('page')

module.exports = ListPage.extend({
	initialize: function(options) {
		this.listViews = []
		this.page = options.page
		this.answers = options.answers

		var badgeId = this.page.badgeId

		if (App.data.badges) {
			this.badge = App.data.badges.get(badgeId)
		}

		if (!this.badge) {
			this.badge = new Page({id: badgeId})
			this.badge.once('sync', this.badgeLoaded, this)
			this.badge.fetch()
		}

		this.model = new Backbone.Model({
			children: [],
			title: this.page.title
		})

		if (this.answers.indexOf(false) === -1) {
			this.generateSuccessModel()
		} else {
			this.generateFailureModel()
		}
	},

	afterRender: function() {
		ListPage.prototype.afterRender.apply(this, arguments)
		this.trigger('ready')
	},

	generateFailureModel: function() {
		var points = []

		// Generate quiz corrections.
		for (var i = 0; i < this.answers.length; i++) {
			var question = this.page.children[i]

			var listItem = {
				'class': 'AnnotatedListItemView',
				annotation: i + 1
			}

			if (this.answers[i]) {
				// Question correct.
				listItem.title = question.completion
			} else {
				listItem.title = question.title
				listItem.description = question.failure
			}

			points.push(listItem)
		}

		this.model.attributes.children = [
			{
				'class': 'GroupView',
				children: [
					{
						'class': 'ListItemView',
						title: this.page.loseMessage
					}
				]
			},
			{
				'class': 'GroupView',
				children: points
			},
			{
				'class': 'GroupView',
				children: [
					{
						'class': 'StandardListItemView',
						title: {
							'class': 'Text',
							content: '_QUIZ_BUTTON_AGAIN'
						},
						link: {
							'class': 'InternalLink',
							destination: ''
						}
					}
				]
			}
		]
	},

	generateSuccessModel: function() {
		this.model.attributes.children = [
			{
				'class': 'GroupView',
				children: [
					{
						'class': 'TextListItemView',
						description: {
							'class': 'Text',
							content: '_QUIZ_WIN_CONGRATULATIONS'
						}
					}
				]
			},
			{
				'class': 'GroupView',
				children: [
					{
						'class': 'ImageListItemView',
						image: this.badge.get('icon')
					}
				]
			},
			{
				'class': 'GroupView',
				children: [
					{
						'class': 'TextListItemView',
						description: this.page.winMessage
					}
				]
			}
		]

		this.$el.addClass('completion')
	},

	badgeLoaded: function() {
		this.model.attributes.children[1].children.image = this.badge.get('icon')
	}
})

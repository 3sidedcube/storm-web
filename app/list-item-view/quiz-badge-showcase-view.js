var ListItemView = require('./list-item-view'),
    Page = require('../page');

require('./quiz-badge-showcase.less');

/**
 * Displays a scrollable list of badges from a list of quizzes, shows
 * completion state and allows navigation to the relevant quiz.
 * @extends {ListItemView}
 */
module.exports = ListItemView.extend({
  /** @override */
  template: require('./quiz-badge-showcase-view-template'),

  /** @override */
  events: {
    'click .badge-list-item': 'badgeListItemClick'
  },

  /** @override @constructor */
  initialize: function() {
    // Load in all referenced quizzes to get their badges.
    /** @type Array.<jQuery.Deferred> */
    var requests = [];

    /** @private @type {Array.<Page>} */
    this.pages_ = this.model.get('quizzes').map(function(url) {
      var id = App.utils.getIdFromCacheUrl(url),
          page = new Page({id: id});

      requests.push(page.fetch());
      return page;
    });

    $.when.apply($, requests).then(this.render.bind(this));
  },

  /** @override */
  getRenderData: function() {
    var badges = this.pages_.map(function(page) {
      var badge;

      if (App.data.badges) {
        badge = App.data.badges.get(page.get('badgeId'));
      }

      return {
        title: page.get('title'),
        badge: badge ? badge.toJSON() : {},
        id: page.id,
        isComplete: isQuizComplete(page.id)
      };
    });

    return {
      badges: badges
    };
  },

  /**
   * Handles clicks on a badge and navigates to the relevant quiz page.
   * @param {Event} e DOM event for the click.
   */
  badgeListItemClick: function(e) {
    var src = $(e.currentTarget).data('src');

    App.router.navigate(src, {trigger: true});
  }
});

/**
 * Checks whether the quiz with the specified {@param id} has been previously
 * completed.
 * @param id The ID of the quiz page to check.
 * @returns {boolean} Whether the quiz has previously been completed.
 */
function isQuizComplete(id) {
  return localStorage.getItem('quiz-' + id) !== null;
}

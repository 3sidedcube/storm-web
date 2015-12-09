/**
 * Defines methods for tracking page views and quiz events with Google
 * Analytics Reads the tracking ID from the application's storm-config file.
 */
module.exports = Backbone.Model.extend({
  /**
   * Initialises the Google Analytics tracker and allows for events to be
   * tracked.
   *
   * This method must be called once before any other tracking methods can be
   * used.
   */
  start: function() {
  },

  /**
   * Tracks a page view with the specified name.
   * @param {string} name The page name/title.
   */
  trackPageView: function(name) {
    console.error('Not implemented', name);
  },

  /**
   * Tracks a custom Google Analytics event.
   * @param {string} category Event category.
   * @param {string} action Event action.
   * @param {?string} [label=null] Event label.
   * @param {number} [value=0] Numeric event value.
   */
  trackEvent: function(category, action, label, value) {
    console.error('Not implemented', category, action, label, value);
  }
});

require('./browser-view.less');

module.exports = Backbone.View.extend({
  template: require('./browser-view-template'),
  className: 'browser-view',

  events: {
    'MSWebViewNavigationStarting x-ms-webview': 'navigationStartingHandler',
    'MSWebViewNavigationCompleted x-ms-webview': 'navigationCompletedHandler',
    'click.AppBar': 'appBarClick'
  },

  /** @override */
  afterRender: function() {
    this.trigger('ready');
    this.webview = this.$('x-ms-webview')[0];
    WinJS.UI.process(this.el);
  },

  /**
   * Sets the webview location.
   * @param {string} uri The URI to set.
   */
  setUri: function(uri) {
    this.webview.src = uri;
  },

  /**
   * Store a reference to the previously loaded page so we can navigate back.
   * @param {string} uri The URI of the previous page.
   */
  setBackTarget: function(uri) {
    this.backTarget = uri;
  },

  /**
   * Handles navigation events to show an indeterminate loading indicator.
   */
  navigationStartingHandler: function() {
    this.$('progress').removeClass('hidden');
  },

  /**
   * Handles navigation completion events to hide the loading indicator.
   */
  navigationCompletedHandler: function() {
    this.$('progress').addClass('hidden');
  },

  /**
   * Handles click events to AppBarCommand buttons for this view, delegated
   * from the body. Dispatches to the relevant handler for the specific button
   * clicked.
   * @param {Event} e Event object for the click.
   * @param {Object} data Payload containing the currentTarget for the
   *     delegated event.
   */
  appBarClick: function(e, data) {
    var $el = $(data.currentTarget);

    if ($el.hasClass('back-button')) {
      this.backButtonClick();
    } else if ($el.hasClass('forward-button')) {
      this.forwardButtonClick();
    } else if ($el.hasClass('browser-button')) {
      this.browserButtonClick();
    }
  },

  /**
   * Handles click events on the webview back button. Navigates the webview
   * back.
   */
  backButtonClick: function() {
    this.webview.goBack();
  },

  /**
   * Handles click events on the webview forward button. Navigates the webview
   * forward.
   */
  forwardButtonClick: function() {
    this.webview.goForward();
  },

  /**
   * Handles click events on the 'open in browser' button. Opens the webview's
   * current URL in the native web browser.
   */
  browserButtonClick: function() {
    App.view.handleUriLink_(this.webview.src);
  }
});

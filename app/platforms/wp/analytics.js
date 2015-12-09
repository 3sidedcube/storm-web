/* global GoogleAnalytics Windows */

var stormConfig = require('../../../storm-config.json');

/**
 * Defines methods for tracking page views and quiz events with Google
 * Analytics, using the Google Analytics SDK for Windows and Windows Phone.
 * Reads the tracking ID from the application's storm-config file.
 */
module.exports = Backbone.Model.extend({
  /** @override @constructor */
  initialize: function() {
    if (!window.Windows) {
      return;
    }

    var config  = new GoogleAnalytics.EasyTrackerConfig(),
        pkg     = Windows.ApplicationModel.Package.current,
        version = pkg.id.version,
        appName = pkg.displayName;

    var versionString = [
      version.major,
      version.minor,
      version.build,
      version.revision
    ].join('.');

    config.trackingId = stormConfig.gaCode;
    config.appName = appName;
    config.appVersion = versionString;

    /** @private @type {Object} */
    this.config_ = config;
  },

  /**
   * Initialises the Google Analytics tracker and allows for events to be
   * tracked.
   *
   * This method must be called once before any other tracking methods can be
   * used.
   */
  start: function() {
    console.info('Configuring Google Analytics, ID:', stormConfig.gaCode);

    if (!window.Windows) {
      return;
    }

    GoogleAnalytics.EasyTracker.current.config = this.config_;

    var app = Windows.UI.WebUI.WebUIApplication;

    app.addEventListener('resuming', function() {
      GoogleAnalytics.EasyTracker.current.onAppResuming();
    });

    app.oncheckpoint = function(args) {
      app.sessionState.history = WinJS.Navigation.history;
      args.setPromise(GoogleAnalytics.EasyTracker.current.onAppSuspending());
    };

    var isReportingException = false;

    app.onerror = function(eventInfo) {
      if (!isReportingException) {
        var error = eventInfo.detail;

        var errorInfo = error.errorMessage + '\n' +
            error.errorUrl + '(' + error.errorLine + ')';

        GoogleAnalytics.EasyTracker.getTracker().sendException(errorInfo, true);
        isReportingException = true;
        GoogleAnalytics.EasyTracker.current.dispatch().done(function() {
          // Once done logging, rethrow to resume normal execution.
          throw error;
        });

        return true;
      }

      return false;
    };
  },

  /**
   * Tracks a page view with the specified name.
   * @param {string} name The page name/title.
   */
  trackPageView: function(name) {
    console.info('Tracking page view:', name);

    if (!window.Windows) {
      return;
    }

    GoogleAnalytics.EasyTracker.getTracker().sendView(name);
  },

  /**
   * Tracks a custom Google Analytics event.
   * @param {string} category Event category.
   * @param {string} action Event action.
   * @param {?string} [label=null] Event label.
   * @param {number} [value=0] Numeric event value.
   */
  trackEvent: function(category, action, label, value) {
    label = label || null;
    value = value || 0;

    console.info('Tracking event, ' +
        'category:', category,
        'action:', action,
        'label:', label,
        'value:', value);

    if (!window.Windows) {
      return;
    }

    GoogleAnalytics.EasyTracker.getTracker()
        .sendEvent(category, action, label, value);
  }
});

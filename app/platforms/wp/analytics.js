/* global GoogleAnalytics Windows */

var stormConfig = require('../../../storm-config.json');

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
   * TODO
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
   * TODO
   * @param {string} name
   */
  trackPageView: function(name) {
    console.info('Tracking page view:', name);

    if (!window.Windows) {
      return;
    }

    GoogleAnalytics.EasyTracker.getTracker().sendView(name);
  },

  /**
   * TODO
   * @param {string} category
   * @param {string} action
   * @param {?string} [label=null]
   * @param {number} [value=0]
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

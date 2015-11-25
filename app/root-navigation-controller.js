/* global Windows */
var NavigationController = require('./navigation-controller');

module.exports = NavigationController.extend({
  template: require('./root-navigation-controller-template'),
  el: '#container',

  events: {
    'click .clickable': 'linkClick'
  },

  initialize: function() {
    NavigationController.prototype.initialize.apply(this, arguments);
    this.render();
  },

  setPageTitle: function() {
  },

  /**
   * Handles clicks to objects with the 'clickable' class, which contain link
   * properties as data attributes.
   *
   * <p>Possible attributes:
   * <ul>
   *   <li>data-uri. The link destination.</li>
   *   <li>data-link-type. The class of the Storm Link object. If no type is
   * specified, it is assumed to be InternalLink. SmsLink and EmailLink objects
   * are not supported and should be reformatted as UriLinks with the correct
   * protocol.</li>
   * </ul>
   *
   * <p>ExternalLink objects will open a URL in the internal browser (if
   * possible). UriLink objects will always kick out to the host
   * browser/system.
   * @param {Event} e The DOM click event object.
   */
  linkClick: function(e) {
    var uri      = $(e.currentTarget).data('uri'),
        linkType = $(e.currentTarget).data('link-type');

    switch (linkType) {
      case 'ExternalLink':
        this.handleExternalLink_(uri);
        break;

      case 'UriLink':
        this.handleUriLink_(uri);
        break;

      case 'ShareLink':
        this.handleShareLink_();
        break;

      case 'TimerLink':
        var duration = +$(e.currentTarget).data('duration') / 1000;

        this.handleTimerLink_(duration, e.currentTarget);
        break;

      case 'AppLink':
        this.handleAppLink_();
        break;

      case 'SmsLink':
      case 'EmailLink':
        throw new Error('SmsLink and EmailLinks are not supported by the ' +
            'RootNavigationController. They should be reformatted as UriLink ' +
            'objects with the correct protocol.');

      case 'InternalLink':
      default:
        this.handleInternalLink_(uri);
    }

    e.stopPropagation();
  },

  /**
   * Handles the URI of an InternalLink, to navigate to another page of the app.
   * @param {string} uri The URI to navigate to.
   * @private
   */
  handleInternalLink_: function(uri) {
    this.setPage(uri, false);
    App.router.navigate(uri);
  },

  /**
   * Handles the URI of an ExternalLink object, to be opened in the internal
   * browser (where possible).
   * @param {string} uri The URI to navigate to.
   * @private
   */
  handleExternalLink_: function(uri) {
    if (!uri) {
      return;
    }

    // Open URL in internal browser.
    var oldUri = this.currentView.id;

    this.setPage('app://browser', false);
    this.currentView.setUri(uri);
    this.currentView.setBackTarget(oldUri);
  },

  /**
   * Handles the URI of a UriLink (i.e. generic handler for multiple
   * protocols). The URI will be passed to the system/browser for handling as
   * appropriate. Can also be used with HTTP links to open them in the default
   * browser instead of the app's embedded browser.
   * @param {string} uri The URI to navigate to.
   * @private
   */
  handleUriLink_: function(uri) {
    // Handle Windows apps using the native SDK.
    if (window.Windows) {
      // Windows dislikes tel links with double slashes. Remove them.
      uri = uri.replace('tel://', 'tel:');

      // Windows Phone doesn't natively support sms links.
      if (uri.match(/^sms:/)) {
        sendWindowsSMS(uri);
        return;
      }

      var url = new Windows.Foundation.Uri(uri);

      Windows.System.Launcher.launchUriAsync(url);
      return;
    }

    // Open URL in a new tab/window.
    window.open(uri, '_blank');
  },

  /**
   * TODO
   * @private
   */
  handleShareLink_: function() {
    throw new Error('Not yet implemented');
  },

  /**
   * Handles the URI of a TimerLink, to launch a countdown timer inline.
   * @param {number} duration The duration of the timer, in seconds.
   * @param {HTMLElement} el The element to display the timer in.
   * @private
   */
  handleTimerLink_: function(duration, el) {
    var $el = $(el),
        isRunning = $el.data('timer-running');

    if (isRunning) {
      return;
    }

    updateTimer();
    var interval = setInterval(updateTimer, 1000);

    function updateTimer() {
      $el.text(formatTimer(duration--));

      if (duration < 0) {
        clearInterval(interval);
      }
    }

    $el.data('timer-running', true);
  },

  /**
   * TODO
   * @private
   */
  handleAppLink_: function() {
    throw new Error('Not yet implemented');
  }
});

/**
 * Handles an sms: link natively on Windows Phone to bring up the SMS compose
 * view with the recipients and body pre-populated.
 * @param {string} uri The sms: URI to handle.
 */
function sendWindowsSMS(uri) {
  var Chat = Windows.ApplicationModel.Chat,
      smsParams = uri.match(/^sms:(?:\/\/)?([^\?]*)(?:\?body=(.*))?$/),
      sms       = new Chat.ChatMessage();

  if (smsParams[1]) {
    var recipients = smsParams[1].split(',');

    for (var i = 0; i < recipients.length; i++) {
      var recipient = decodeURIComponent(recipients[i]);

      sms.recipients.push(recipient);
    }
  }

  if (smsParams[2]) {
    sms.body = decodeURIComponent(smsParams[2]);
  }

  Chat.ChatMessageManager.showComposeSmsMessageAsync(sms);
}

/**
 * Formats the specified {@param count} (in seconds) as m:ss.
 * @param {number} count The time (in seconds) to format.
 * @returns {string} The count as colon separated minutes and seconds.
 */
function formatTimer(count) {
  var minutes = Math.floor(count / 60),
      seconds = Math.floor(count % 60);

  if (seconds < 10) {
    seconds = '0' + seconds;
  }

  return minutes + ':' + seconds;
}

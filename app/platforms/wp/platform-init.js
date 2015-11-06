/* global Windows */

if (!window.WinJS) {
  require('winjs');
  require('winjs/css/ui-light.css');
}

require('./overrides.less');
require('./../../../vendor/winstore-jscompat');

var NavigationController = require('../../navigation-controller');

if (window.Windows) {
  var HardwareButtons = Windows.Phone.UI.Input.HardwareButtons;

  HardwareButtons.addEventListener('backpressed', function(e) {
    e.handled = true;
    history.back();
  });
}

var transition = function() {
  var newPage = this.newPageContent,
      oldPage = this.pageContent;

  return new Promise(function(resolve) {
    WinJS.UI.Animation.exitPage(oldPage[0], null).done(function() {
      newPage.addClass('page-transitioning');

      WinJS.UI.Animation.enterPage(newPage[0], null).done(function() {
        newPage.removeClass('page-transitioning');
        resolve();
      });
    });
  });
};

NavigationController.prototype.transitionForward = transition;
NavigationController.prototype.transitionBackward = transition;
NavigationController.prototype.transitionNew = transition;

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

  var statusBar = Windows.UI.ViewManagement.StatusBar.getForCurrentView();

  statusBar.backgroundOpacity = 1;
  statusBar.backgroundColor = Windows.UI.ColorHelper.fromArgb(255, 252, 61, 56);
  statusBar.foregroundColor = Windows.UI.Colors.lightGray;
  statusBar.showAsync();
}

var Animation = WinJS.UI.Animation;

var transition = function() {
  var newPage = this.pageContent,
      oldPage = this.newPageContent;

  return new Promise(function(resolve) {
    Animation.exitPage(oldPage[0], null).done(function() {
      Animation.enterPage(newPage[0], null).done(function() {
        resolve();
      });
    });
  });
};

var Nav = NavigationController.prototype;

Nav.transitionForward = transition;
Nav.transitionBackward = transition;
Nav.transitionNew = transition;

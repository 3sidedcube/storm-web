if (!window.WinJS) {
  require('winjs');
  require('winjs/css/ui-light.css');
}

require('./overrides.less');

var NavigationController = require('../../navigation-controller');

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

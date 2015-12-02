/* global Windows */

var WIN_BODY = 'data-storm-win-body';

if (!window.WinJS) {
  require('winjs');
  require('winjs/css/ui-light.css');
}

require('./overrides.less');
require('./../../../vendor/winstore-jscompat');

var NavigationController = require('../../navigation-controller'),
    rangeInputEventFix = require('./range-input-event-fix');

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

  rangeInputEventFix();
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

Backbone.View.prototype.renderWinJSBodyControls = function() {
  this.$('[' + WIN_BODY + ']').each(function() {
    var id         = $(this).attr(WIN_BODY),
        selector   = 'body > [' + WIN_BODY + '=' + id + ']',
        previousEl = document.querySelector(selector);

    if (previousEl) {
      if (previousEl.winControl) {
        previousEl.winControl.dispose();
      }

      document.body.removeChild(previousEl);
    }

    var child = $(this).clone().appendTo('body');

    WinJS.UI.process(child[0]);
  });
};

var oldRender  = Backbone.View.prototype.render,
    oldRestore = Backbone.View.prototype.restore,
    oldSuspend = Backbone.View.prototype.suspend;

Backbone.View.prototype.render = function() {
  oldRender.apply(this, arguments);
  this.renderWinJSBodyControls();
  return this;
};

Backbone.View.prototype.restore = function() {
  oldRestore.apply(this, arguments);
  this.renderWinJSBodyControls();
};

Backbone.View.prototype.suspend = function() {
  oldSuspend.apply(this, arguments);

  // Destroy any WinJS controls created by this view.
  this.$('[' + WIN_BODY + ']').each(function() {
    var id = $(this).attr(WIN_BODY);

    $('body > [' + WIN_BODY + '=' + id + ']').each(function() {
      if (this.winControl) {
        this.winControl.dispose();
      }

      $(this).remove();
    });
  });
};

// Forward any events from root-level WinJS controls to the correct views,
// namespaced.
$(document).ready(function() {
  var selector = '> [data-storm-win-body] ' +
      '[data-win-control="WinJS.UI.AppBarCommand"]';

  $('body').on('click', selector, function() {
    var data = {currentTarget: this};

    if (App.view && App.view.currentView) {
      App.view.currentView.$el.trigger('click.AppBar', data);
    }

    if ($(this).hasClass('clickable') && App.view) {
      var event = new jQuery.Event('click');

      event.currentTarget = this;
      App.view.linkClick(event);
    }
  });
});

var PageView = require('./page-view');

var SLIDE_LEFT  = 'slide-left',
    SLIDE_RIGHT = 'slide-right',
    SCALE       = 'scale';

require('./navigation-controller.less');
require('./transitions.less');

module.exports = PageView.extend({
  initialize: function() {
    PageView.prototype.initialize.apply(this, arguments);
    this.viewStack = [];
    this.currentView = null;
    this.prevView = null;
  },

  afterRender: function() {
    this.pageContent = this.$('> .page-content');
    this.newPageContent = this.$('> .new-page-content');
    this.$el.addClass('navigation-controller');
  },

  setPage: function(id, newStack) {
    console.info('Pushing to view ID', id);

    // Stop any animations still running.
    var animationClasses = [SLIDE_LEFT, SLIDE_RIGHT, SCALE];

    var classes = this.pageContent[0] ? this.pageContent[0].classList : [];

    for (var i = 0; i < classes.length; i++) {
      var className = classes[i];

      if (animationClasses.indexOf(className) > -1) {
        this.pageContent.trigger('animationend');
        break;
      }
    }

    var oldView = this.currentView,
        newView,
        transitionClass;

    // Don't navigate to the current view.
    if (oldView && id === oldView.id) {
      return;
    }

    if (newStack) {
      this.viewStack.forEach(function(view) {
        view.destroy();
      });

      this.viewStack = [];
    }

    // Check if the view we want is on top of the stack.
    var lastView  = this.viewStack[this.viewStack.length - 1],
        rerender  = false,
        goingBack = false;

    if (lastView && lastView.id === id) {
      console.info('Pushing back to last view');

      this.viewStack.splice(this.viewStack.length - 1, 1);
      this.setPageTitle();

      newView = lastView;
      goingBack = true;
      oldView = null;
    } else {
      newView = this.buildView(id);
      rerender = true;
    }

    var stackLength = this.viewStack.length,
        canGoBack   = !(newStack || stackLength === 0 && newView === lastView);

    this.$('.back-button').toggle(canGoBack);

    this.newPageContent.html(newView.el);
    this.currentView = newView;

    newView.once('ready', function() {
      console.info('View ready');

      // Replace abstract Page instances with typed views, if the type wasn't
      // available at fetch.
      if (newView.constructor === PageView) {
        var PageViewBuilder = require('./page-view-builder');

        newView = PageViewBuilder.buildFromModel(newView.id, newView.model);
        this.currentView = newView;
        this.newPageContent.html(newView.el);
        newView.render();
      }

      var self = this;

      this.setPageTitle();
      this.prevView = oldView;

      var transition;

      if (newStack) {
        transition = this.transitionNew();
      } else if (goingBack) {
        transition = this.transitionBackward();
      } else {
        transition = this.transitionForward();
      }

      transition.then(function() {
        console.log('hi')
        self.pageContent.toggleClass('page-content new-page-content');
        self.newPageContent.toggleClass('page-content new-page-content');

        var temp = self.pageContent;

        self.pageContent = self.newPageContent;
        self.newPageContent = temp;

        setTimeout(function() {
          self.newPageContent.find('.focus').removeClass('focus');
        }, 100);
      });
    }, this);

    if (rerender) {
      newView.render();
    } else {
      newView.delegateEvents();
    }

    // If we've popped the last view off the stack it's already ready.
    if (lastView && lastView.id === id) {
      newView.trigger('ready');
    }
  },

  transitionForward: function() {
    var newView = this.currentView,
        oldView = this.prevView;

    return new Promise(function(resolve) {
      this.pageContent.addClass(SLIDE_LEFT);
      this.newPageContent.addClass(SLIDE_LEFT);

      this.pageContent.one('animationend webkitAnimationEnd', function() {
        // Don't do anything if we've already navigated away from this view.
        if (newView.id !== this.currentView.id) {
          return;
        }

        this.pageContent.removeClass(SLIDE_LEFT);
        this.newPageContent.removeClass(SLIDE_LEFT);

        if (oldView) {
          this.viewStack.push(oldView);
        }

        resolve();
      }.bind(this));
    }.bind(this));
  },

  transitionBackward: function() {
    var newView = this.currentView,
        oldView = this.prevView;

    return new Promise(function(resolve) {
      this.pageContent.addClass(SLIDE_RIGHT);
      this.newPageContent.addClass(SLIDE_RIGHT);

      this.pageContent.one('animationend webkitAnimationEnd', function() {
        // Don't do anything if we've already navigated away from this view.
        if (newView.id !== this.currentView.id) {
          return;
        }

        this.pageContent.removeClass(SLIDE_RIGHT);
        this.newPageContent.removeClass(SLIDE_RIGHT);

        // TODO clean up previous view?
        resolve();
      }.bind(this));
    }.bind(this));
  },

  transitionNew: function() {
    var newView = this.currentView,
        oldView = this.prevView;

    return new Promise(function(resolve) {
      this.pageContent.addClass(SCALE);
      this.newPageContent.addClass(SCALE);

      this.pageContent.one('animationend webkitAnimationEnd', function() {
        // Don't do anything if we've already navigated away from this view.
        if (newView.id !== this.currentView.id) {
          return;
        }

        this.pageContent.removeClass(SCALE);
        this.newPageContent.removeClass(SCALE);

        if (oldView) {
          oldView.destroy();
        }

        resolve();
      }.bind(this));
    }.bind(this));
  },

  buildView: function(url) {
    var PageViewBuilder = require('./page-view-builder');

    return PageViewBuilder.build(url);
  },

  destroy: function() {
    PageView.prototype.destroy.call(this);

    this.viewStack.forEach(function(view) {
      view.destroy();
    });
  }
});

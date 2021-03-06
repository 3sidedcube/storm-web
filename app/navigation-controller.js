var PageView = require('./page-view'),
    l        = require('./helpers/l');

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
    this.transitionCount = 0;
  },

  afterRender: function() {
    this.pageContent = this.$('> .page-content');
    this.newPageContent = this.$('> .new-page-content');
    this.$el.addClass('navigation-controller');
  },

  setPage: function(id, newStack) {
    console.info('Pushing to view ID', id);

    this.$el.addClass('transitioning');
    this.transitionCount++;

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

    var pageId  = App.bundleManager.getResourceUrl(id),
        oldView = this.currentView,
        newView;

    // Don't navigate to the current view.
    if (oldView && pageId === oldView.id) {
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

    if (lastView && lastView.id === pageId) {
      console.info('Pushing back to last view');

      this.viewStack.pop();
      this.setPageTitle();

      newView = lastView;
      goingBack = true;
    } else {
      newView = this.buildView(id);
      rerender = true;
    }

    var stackLength = this.viewStack.length,
        canGoBack   = !(newStack || stackLength === 0 && newView === lastView);

    this.$('.back-button').toggle(canGoBack);

    this.newPageContent.html(newView.el)
        .scrollTop(0);

    this.currentView = newView;

    this.pageContent.toggleClass('page-content new-page-content');
    this.newPageContent.toggleClass('page-content new-page-content');

    var temp = this.pageContent;

    this.pageContent = this.newPageContent;
    this.newPageContent = temp;

    newView.once('ready', function() {
      console.info('View ready');

      if (App.analytics) {
        this.trackPageView(newView.model, id);
      }

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

      var transition;

      if (newStack) {
        transition = this.transitionNew();

        // Clean up final view (was never pushed to view stack).
        transition.then(function() {
          if (oldView) {
            oldView.destroy();
          }
        });
      } else if (goingBack) {
        transition = this.transitionBackward();

        transition.then(function() {
          if (oldView) {
            oldView.destroy();
          }
        });
      } else {
        transition = this.transitionForward();

        if (oldView) {
          this.viewStack.push(oldView);
        }
      }

      if (oldView) {
        oldView.suspend();
      }

      transition.then(function() {
        if (--self.transitionCount === 0) {
          self.$el.removeClass('transitioning');
        }
      });
    }, this);

    if (rerender) {
      newView.render();
    } else {
      newView.restore();
    }

    // If we've popped the last view off the stack it's already ready.
    if (lastView && lastView.id === pageId) {
      newView.trigger('ready');
    }
  },

  transitionForward: function() {
    var newView = this.currentView;

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

        resolve();
      }.bind(this));
    }.bind(this));
  },

  transitionBackward: function() {
    var newView = this.currentView;

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

        resolve();
      }.bind(this));
    }.bind(this));
  },

  transitionNew: function() {
    var newView = this.currentView;

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

        resolve();
      }.bind(this));
    }.bind(this));
  },

  buildView: function(url) {
    var PageViewBuilder = require('./page-view-builder');

    return PageViewBuilder.build(url);
  },

  trackPageView: function(model, id) {
    var name = id;

    if (model) {
      name = l(model.get('title')) || name;

      // Don't track quiz questions.
      if (model && model.get('class') === 'QuizPage') {
        return;
      }
    }

    App.analytics.trackPageView(name);
  },

  destroy: function() {
    PageView.prototype.destroy.call(this);

    this.viewStack.forEach(function(view) {
      view.destroy();
    });
  }
});

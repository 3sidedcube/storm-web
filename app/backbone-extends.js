Backbone.View.prototype.afterInitialize = function() {
};

Backbone.View.prototype.template = function() {
};

Backbone.View.prototype.getRenderData = function() {
  return this.model ? this.model.toJSON() : {};
};

Backbone.View.prototype.render = function(data) {
  // Render from template
  this.$el.html(this.template(this.getRenderData(), {data: data}));

  // Render all subviews
  var views = this.views || {};

  Object.keys(views).forEach(function(key) {
    var view = views[key];

    this.$el.append(view.render().el);
  }, this);

  this.afterRender();
  return this;
};

Backbone.View.prototype.afterRender = function() {
};

Backbone.View.prototype.beforeDestroy = function() {
};

Backbone.View.prototype.destroy = function() {
  // Run any extra cleanup (saving etc)
  this.beforeDestroy();

  // Remove any child views first
  if (this.views) {
    this.views.forEach(function(view) {
      view.destroy();
    });
  }

  if (this.listViews) {
    this.listViews.forEach(function(view) {
      view.destroy();
    });
  }

  // Remove view
  this.remove();
  this.unbind();
};

/**
 * Clears up any state (e.g. focus states) when pushing a view onto the view
 * stack to potentially be restored later on.
 */
Backbone.View.prototype.suspend = function() {
  var self = this;

  setTimeout(function() {
    self.$('.focus').removeClass('focus');
  }, 600);
};

/**
 * Re-delegates events for the view and any children. Called whenever a view is
 * restored from the view stack without re-rendering.
 */
Backbone.View.prototype.restore = function() {
  this.delegateEvents();

  if (this.listViews) {
    this.listViews.forEach(function(view) {
      view.restore();
    });
  }
};

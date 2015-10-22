module.exports = Backbone.Model.extend({
  initialize: function(options) {
    this.url = 'bundle/languages/' + options.lang.src;
  }
});

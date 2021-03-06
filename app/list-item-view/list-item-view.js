var linkTo = require('../helpers/linkTo');

require('./list-item-view.less');

module.exports = Backbone.View.extend({
  template: require('./list-item-view-template'),
  className: 'ListItem',

  events: {
    'change input': 'inputChange'
  },

  afterRender: function() {
    this.$el.addClass(this.model.get('class'));

    if (this.model.has('link')) {
      var attrs = linkTo.getLinkAttributes(this.model.get('link'));

      Object.keys(attrs).forEach(function(key) {
        this.$el.attr('data-' + key, attrs[key]);
      }, this);

      this.$el.addClass('clickable');
    }

    if (this.model.get('class') === 'CheckableListItemView') {
      this.$el.prepend('<input type="checkbox">');

      var isChecked = localStorage.getItem('check-' + this.model.id) === 'true';

      this.$('input')[0].checked = isChecked;
    }
  },

  inputChange: function(e) {
    var isCheckable = this.model.get('class') === 'CheckableListItemView';

    if (isCheckable && !this.model.get('volatile')) {
      localStorage.setItem('check-' + this.model.id, e.currentTarget.checked);
    }
  }
});

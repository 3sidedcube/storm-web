var CollectionCell = {
  QuizCollectionCell: require('./quiz-collection-cell-view'),
  AppCollectionCell: require('./app-collection-cell-view'),
  LinkCollectionCell: require('./link-collection-cell-view')
};

require('./collection-list-item-view.less');

module.exports = Backbone.View.extend({
  template: require('./collection-list-item-view-template'),
  className: 'CollectionListItemView',

  initialize: function() {
    this.listItems = [];
  },

  afterRender: function() {
    // Clear all previous cells.
    this.listItems.forEach(function(view) {
      view.destroy();
    });

    this.listItems = [];

    var cells = this.model.get('cells');

    if (cells.length === 0) {
      return;
    }

    // Limit collection view contents to type in first cell.
    var type = cells[0]['class'];

    cells.forEach(function(cell) {
      if (cell['class'] !== type) {
        return;
      }

      var view = new CollectionCell[type]({model: new Backbone.Model(cell)});
      this.listItems.push(view);
      this.$('.cells').append(view.render().el);
    }, this);

    this.renderPagingDots();
  },

  renderPagingDots: function() {
    console.log(this.$('.cells')[0].scrollWidth);
    console.log(this.$('.cells')[0].offsetWidth);
  }
});

var PageView  = require('../../../page-view'),
    GroupView = require('../../../group-view/group-view')

module.exports = PageView.extend({
  template: require('./list-page-view-template'),

  afterRender: function() {
    // Clear all previous child views.
    this.listViews.forEach(function(view) {
      view.destroy()
    })

    this.listViews = []

    var listView = this.el.children[0]
    WinJS.UI.process(listView)

    listView.winControl.itemDataSource = new WinJS.Binding.List(this.model.get('children')).dataSource
    listView.winControl.itemTemplate = this.getGroupView.bind(this)
    listView.winControl.selectionMode = 'none'
    listView.winControl.tapBehavior = 'none',
    listView.winControl.layout = new WinJS.UI.CellSpanningLayout({
      orientation: WinJS.UI.Orientation.vertical,
      groupInfo: {
        enableCellSpanning: true,
        cellWidth: 300,
        cellHeight: 200
      }
    })
  },

  getGroupView: function(itemPromise) {
    return itemPromise.then(function(item) {
      var view = new GroupView({model: new Backbone.Model(item.data)})
      this.listViews.push(view)
      return view.render().el
    }.bind(this))
  }
})

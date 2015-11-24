var PageView = require('../app/page-view'),
    Page     = require('../app/page');

describe('PageView', function() {
  var pageUrl;

  before(function() {
    pageUrl = Page.prototype.url;

    Page.prototype.url = function() {
      return './test';
    };
  });

  after(function() {
    Page.prototype.url = pageUrl;
  });

  it('adds a class name with the source page ID to the root element', function() {
    var pageId = 5;
    var className = 'page-' + pageId;
    var view1 = new PageView({model: new Page({id: pageId})});
    var view2 = new PageView({pageId: pageId});

    view1.render();
    view2.render();

    expect(view1.$el.hasClass(className)).to.be.true;
    expect(view1.$el.hasClass(className)).to.be.true;
  });
});

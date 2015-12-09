var BundleUpdate = require('../app/bundle-update'),
    sinon        = require('sinon');

describe('BundleUpdate', function() {
  before(function() {
    window.App = window.App || {};
    App.apiRoot = 'http://localhost/';
  });

  describe('constructor', function() {
    it('requires an app ID to be specified', function() {
      expect(function() {
        new BundleUpdate();
      }).to.throw();

      expect(function() {
        new BundleUpdate({});
      }).to.throw();
    });
  });

  describe('#url()', function() {
    it('includes the specified app ID', function() {
      var appId  = 4,
          update = new BundleUpdate({appId: appId, apiRoot: ''});

      expect(update.url()).to.contain('/' + appId + '/');
    });
  });

  describe('#download', function() {
    var requests,
        xhr;

    before(function() {
      xhr = sinon.useFakeXMLHttpRequest();
      requests = [];
      xhr.onCreate = function(req) {
        requests.push(req);
      };
    });

    after(function() {
      if (xhr.restore) {
        xhr.restore();
      }
    });

    it('includes the timestamp in the query string', function() {
      var update    = new BundleUpdate({appId: 2, apiRoot: ''}),
          timestamp = 1234;

      update.download(timestamp);

      expect(requests.length).to.equal(1);
      expect(requests[0].url).to.contain('?timestamp=' + timestamp);
    });

    it('fulfills its promise with file data', function(done) {
      var update    = new BundleUpdate({appId: 2, apiRoot: ''}),
          timestamp = 1234;

      // Point update at test bundle.
      xhr.restore();
      update.url = function() {
        return 'base/tests/data/test-delta.tar.gz';
      };

      return update.download(timestamp).then(function(files) {
        expect(files.length).to.equal(5);
        expect(files[0].name).to.equal('app.json');
        expect(files[0].size).to.equal(7148);
        done();
      });
    });
  });
});

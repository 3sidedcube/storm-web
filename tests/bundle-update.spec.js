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
          update = new BundleUpdate({appId: appId});

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
      var update    = new BundleUpdate({appId: 2}),
          timestamp = 1234;

      update.download(timestamp);

      expect(requests.length).to.equal(1);
      expect(requests[0].url).to.contain('?timestamp=' + timestamp);
    });

    it('emits "file" events with file data', function(done) {
      var update    = new BundleUpdate({appId: 2}),
          timestamp = 1234;

      var files = {};

      update.on('file', function(path, file) {
        files[path] = file;
      });

      // Point update at test bundle.
      xhr.restore();
      update.url = function() {
        return 'base/tests/data/test-delta.tar.gz';
      };

      return update.download(timestamp).then(function() {
        expect('app.json' in files).to.be.true;
        expect(Object.keys(files).length).to.equal(5);
        expect(files['app.json'].length).to.equal(7148);
        done();
      });
    });
  });
});

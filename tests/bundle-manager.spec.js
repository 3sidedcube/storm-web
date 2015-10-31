var rewire = require('rewire'),
    fs = require('../app/testing/fake-file-system');

var BundleManager = rewire('../app/bundle-manager');

describe('BundleManager', function() {
  before(function(done) {
    // Mock out FileSystem with fake implementation.
    BundleManager.__set__('FileSystem', fs);
    fs.init().then(done);
  });

  beforeEach(function() {
    fs.files_ = {};
  });

  it('passes through URLs unchanged when uninitialised', function() {
    var bm = new BundleManager();

    var inUrl = 'bundle/test.json';
    var outUrl = bm.getResourceUrl(inUrl);

    expect(inUrl).to.equal(outUrl);
  });

  it('supports initialisation', function() {
    var bm = new BundleManager();

    return bm.init();
  });

  it('returns custom URLs for updated resources', function() {
    var bm = new BundleManager();

    fs.files_['updatedResources.dat'] = 'bundle/testfile.txt';

    return bm.init().then(function() {
      var resolvedUrl = bm.getResourceUrl('cache://testfile.txt');

      expect(resolvedUrl).to.equal('cdvfile://persistent/bundle/testfile.txt');
    });
  });
});

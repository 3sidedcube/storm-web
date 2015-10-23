var filer = require('filer');

var sync = Backbone.sync;
var fs = new filer.FileSystem({
  provider: filer.FileSystem.providers.Fallback() // eslint-disable-line
});

Backbone.sync = function(method, model, options) {
  var path = model.url();

  if (method !== 'read' || !path.matches(/^bundle\//)) {
    return Backbone.sync.call(this, method, model, options);
  }

  var deferred = new $.Deferred();

  // Check in-memory store for updated versions first.
  filer.exists(path, function(exists) {
    if (exists) {
      fs.readFile(path, 'utf8', function(err, data) {
        if (err) {
          deferred.reject(null, null, err);
          throw err;
        }

        deferred.resolve(JSON.parse(data));
      });
    } else {
      // Fall back to default bundle.
      sync.call(this, method, model, options)
          .then(deferred.resolve, deferred.reject);
    }
  });

  return deferred;
};

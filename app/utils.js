var utils = {};

utils.getIdFromCacheUrl = function(url) {
  if (!url) {
    return -1;
  }

  var urlMatch = url.match(/cache:\/\/pages\/(\d+)\.json/);

  if (urlMatch === null) {
    return -1;
  }

  return +urlMatch[1];
};

module.exports = utils;

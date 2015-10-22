/**
 * Handlebars helper to sum up all passed arguments.
 */
module.exports = function() {
  var params = Array.prototype.slice.call(arguments, 0, arguments.length - 1)

  return params.reduce(function(a, b) {
    return a + b
  })
}

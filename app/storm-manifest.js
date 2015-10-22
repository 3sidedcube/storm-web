module.exports = Backbone.Model.extend({
  url: 'bundle/manifest.json',

  initialize: function() {
    this.map = {}
  },

  generateMap: function() {
    var languages = this.get('languages') || []

    for (var i = 0; i < languages.length; i++) {
      var language = languages[i],
          code     = language.src.substr(4)

      this.map[code] = language
    }
  }
})

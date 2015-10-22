require('./browser-view.less')

module.exports = Backbone.View.extend({
  template: require('./browser-view-template'),
  className: 'browser-view',

  events: {
    'click .back-button': 'exit',
    'click .browser-back-button': 'back',
    'click .browser-forward-button': 'forward',
    'click .browser-share-button': 'share',

    'touchstart  .browser-footer button': 'buttonTouchStart',
    'touchend    .browser-footer button': 'buttonTouchEnd',
    'touchcancel .browser-footer button': 'buttonTouchEnd'
  },

  afterRender: function() {
    this.backTarget = null
    this.iframe = this.$('iframe')[0]
    this.trigger('ready')
  },

  // Set iframe location.
  setUri: function(uri) {
    this.iframe.src = uri
  },

  // Store a reference to the previously loaded page so we can navigate back.
  setBackTarget: function(uri) {
    this.backTarget = uri
  },

  // Push iframe back.
  back: function() {
    history.back()
  },

  // Push iframe forward.
  forward: function() {
    history.forward()
  },

  // Open (original) URL in external browser.
  share: function() {
    window.open(this.iframe.src, '_blank')
  },

  // Navigate back to previous page.
  exit: function() {
    App.router.navigate(this.backTarget, {trigger: true, replace: true})
  },

  // Add glow state to buttons on touch.
  buttonTouchStart: function(e) {
    e.currentTarget.classList.add('glow')
  },

  // Remove glow state from buttons.
  buttonTouchEnd: function(e) {
    e.currentTarget.classList.remove('glow')
  }
})

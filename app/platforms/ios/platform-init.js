var FastClick = require('fastclick');

require('../../../style-paper.less');
require('./image-slider-selection-question-view.less');

$(document).ready(function() {
  $(document).on('touchstart', '.clickable', function(e) {
    $(e.currentTarget).addClass('focus');
  });

  $(document).on('touchmove touchcancel', '.clickable', function(e) {
    $(e.currentTarget).removeClass('focus');
  });

  var isIOS = navigator.userAgent.match(/(iPod|iPhone|iPad)/) !== null;

  if (isIOS) {
    FastClick.attach(document.body);
  }
});

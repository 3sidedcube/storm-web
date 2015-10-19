var FastClick = require('fastclick')

require('../../../style-paper.less')

$(document).ready(function() {
	$(document).on('touchstart', '.clickable', function(e) {
		$(e.currentTarget).addClass('focus')
	})

	$(document).on('touchmove touchcancel', '.clickable', function(e) {
		$(e.currentTarget).removeClass('focus')
	})

	var isIOS = navigator.userAgent.match(/(iPod|iPhone|iPad)/) !== null

	if (isIOS) {
		FastClick.attach(document.body)
	}
})

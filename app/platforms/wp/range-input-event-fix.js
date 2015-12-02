/**
 * Fixes the 'input' event not firing on input[type=range]. 'change' events
 * fire in the way 'input' should, so swap them over.
 */
module.exports = function() {
  var currentSlider;
  var fireChange = function() {
    var changeEvent = document.createEvent('Event');

    changeEvent.initEvent('change', true, true);
    changeEvent.forceChange = true;
    currentSlider.dispatchEvent(changeEvent);
  };

  document.addEventListener('change', function(e) {
    var inputEvent;

    if (!e.forceChange && e.target.getAttribute('type') === 'range') {
      e.stopPropagation();
      inputEvent = document.createEvent('Event');
      inputEvent.initEvent('input', true, true);

      e.target.dispatchEvent(inputEvent);

      currentSlider = e.target;
      document.removeEventListener('mouseup', fireChange);
      document.addEventListener('mouseup', fireChange);
    }
  }, true);
};

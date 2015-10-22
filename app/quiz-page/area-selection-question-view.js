var SELECTION_SIZE = 32;

var QuizQuestion = require('./quiz-question-view');

module.exports = QuizQuestion.extend({
  template: require('./area-selection-question-view-template'),
  className: 'AreaSelectionQuestion',

  initialize: function() {
    QuizQuestion.prototype.initialize.apply(this, arguments);

    this._isCorrect = false;
  },

  events: {
    'click .area-image img': 'areaTouch'
  },

  areaTouch: function(e) {
    var container = this.$('.area-image')[0];

    var touchX = e.offsetX + e.currentTarget.offsetLeft,
        touchY = e.offsetY + e.currentTarget.offsetTop;

    // Draw circle around point.
    this.$('.selected-region').remove();
    var circle = $('<div class="selected-region">').appendTo('.area-image');

    circle.css({
      width: SELECTION_SIZE,
      height: SELECTION_SIZE,
      left: touchX - SELECTION_SIZE / 2,
      top: touchY - SELECTION_SIZE / 2
    });

    // Check if this point is valid.
    var zones  = this.model.get('answer'),
        imageW = e.currentTarget.width,
        imageH = e.currentTarget.height;

    var point = {
      x: e.offsetX / imageW,
      y: e.offsetY / imageH
    };

    // Check whether the selected point is within any of the allowed Zone polygons.
    this._isCorrect = false;

    for (var i in zones) {
      var zone     = zones[i],
          isInside = pointIsInsidePolygon(point, zone.coordinates);

      if (isInside) {
        this._isCorrect = true;
        break;
      }
    }
  },

  isCorrect: function() {
    return this._isCorrect;
  }
});

function pointIsInsidePolygon(point, polygon) {
  var inside = false;

  for (var i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    var xi = polygon[i].x, yi = polygon[i].y;
    var xj = polygon[j].x, yj = polygon[j].y;

    var intersect = ((yi > point.y) != (yj > point.y)) && (point.x < (xj - xi) * (point.y - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }

  return inside;
}

var Questions = {
  TextSelectionQuestion: require('./text-selection-question-view'),
  ImageSelectionQuestion: require('./image-selection-question-view'),
  AreaSelectionQuestion: require('./area-selection-question-view'),
  SliderSelectionQuestion: require('./slider-selection-question-view'),
  ImageSliderSelectionQuestion:
      require('./image-slider-selection-question-view'),
  CategorySelectionQuestion: require('./category-selection-question-view')
};

module.exports = {
  build: function(model) {
    var Question = Questions[model.get('class')];

    return new Question({model: model});
  }
};

require('./quiz-question.less');

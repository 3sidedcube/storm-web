var NavigationController    = require('../navigation-controller'),
    QuizQuestionViewBuilder = require('./quiz-question-view-builder'),
    QuizCompleteView        = require('./quiz-complete-view'),
    SharingManager          = require('current-platform/sharing-manager'),
    l                       = require('../helpers/l'),
    getImageUrl             = require('../helpers/getImageUrl'),
    QuizUtils               = require('./quiz-utils');

require('./quiz-page.less');

module.exports = NavigationController.extend({
  template: require('./quiz-page-view-template'),
  className: 'QuizPage',

  events: {
    'click .quiz-next-button': 'nextQuestion',
    'click .quiz-back-button': 'prevQuestion',

    'click .quiz-finish-button': 'finishQuiz',
    'click .clickable': 'restart',
    'click .quiz-share-button': 'shareButtonClick',

    'touchstart .quiz-next-button, .quiz-back-button': 'buttonTouchStart',
    'touchend .quiz-next-button, .quiz-back-button': 'buttonTouchEnd',
    'touchcancel .quiz-next-button, .quiz-back-button': 'buttonTouchEnd'
  },

  initialize: function(options) {
    NavigationController.prototype.initialize.apply(this, arguments);
    this.previousURL = options.previousURL;
  },

  ready: function() {
    this.render();
    this.trigger('ready');

    this.answers = [];

    // If quiz already completed, show badge.
    if (QuizUtils.isQuizComplete(this.model.id)) {
      var questions = this.model.get('children');

      this.setPage(questions.length, 0);
    } else {
      // Load first question.
      var pages = this.model.get('children');

      if (!pages) {
        return;
      }

      this.currentQuestion = 0;
      this.setPage(0, true);
    }

    if (App.analytics) {
      var name = l(this.model.get('title'));

      App.analytics.trackEvent('Quiz', 'Start ' + name + ' quiz');
    }
  },

  buildView: function(id) {
    var questions = this.model.get('children'),
        view;

    if (id === questions.length) {
      // Quiz complete.
      view = new QuizCompleteView({
        answers: this.answers,
        page: this.model.toJSON()
      });

      this.$('.completion-toggle').toggle();

      // Hide 'Share' button if there are mistakes.
      var allCorrect = this.answers.every(function(q) {
            return q;
          }),
          visibility = 'visible';

      if (!allCorrect) {
        visibility = 'hidden';
      }

      this.$('.quiz-share-button').css('visibility', visibility);
    } else {
      var model = new Backbone.Model(questions[id]);

      view = QuizQuestionViewBuilder.build(model);
    }

    view.pageId = id;

    return view;
  },

  setPageTitle: function() {
    var questionNumber = this.currentQuestion + 1,
        questions      = this.model.get('children'),
        questionCount  = questions.length,
        of             = App.language.get('_QUIZ_OF') || 'of';

    this.$('> .navigation-controller-header .progress-text')
        .text(questionNumber + ' ' + of + ' ' + questionCount);

    // Set progress bar value and caption.
    this.$('.navigation-controller-header progress')
        .attr('max', questionCount)
        .attr('value', questionNumber);
  },

  nextQuestion: function() {
    // Set whether the current question was correct or not.
    this.answers[this.currentQuestion] = this.currentView.isCorrect();
    this.setPage(++this.currentQuestion);
  },

  prevQuestion: function() {
    if (--this.currentQuestion >= 0) {
      this.setPage(this.currentQuestion);
    } else {
      history.go(-1);
    }
  },

  buttonTouchStart: function(e) {
    $(e.currentTarget).addClass('glow');
  },

  buttonTouchEnd: function(e) {
    $(e.currentTarget).removeClass('glow');
  },

  beforeDestroy: function() {
    // Clean up all child views.
    this.viewStack.forEach(function(view) {
      view.destroy();
    });

    this.viewStack = [];
  },

  restart: function(e) {
    this.$('.completion-toggle').toggle();

    this.currentQuestion = 0;
    this.setPage(0);
    e.stopPropagation();

    if (App.analytics) {
      var name = l(this.model.get('title'));

      App.analytics.trackEvent('Quiz', 'Try again: ' + name);
    }
  },

  shareButtonClick: function() {
    if (App.data.badges) {
      var badge = App.data.badges.get(this.model.get('badgeId'));

      if (!badge) {
        return;
      }

      var title    = l(badge.get('title')),
          body     = l(badge.get('shareMessage')),
          imageUrl = getImageUrl(badge.get('icon'));

      SharingManager.share(title, body, imageUrl);
    }
  },

  finishQuiz: function() {
    // Return to page which launched into this quiz.
    history.back();
  }
});

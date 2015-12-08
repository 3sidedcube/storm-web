var StormLanguage = require('./storm-language'),
    StormData     = require('./storm-data'),
    stormConfig   = require('../storm-config.json'),
    OnboardView   = require('./onboard-view/onboard-view'),
    BundleManager = require('./bundle-manager');

var MASK_SIZE = '(-webkit-mask-size: contain) or (mask-size: contain)';

require('./backbone-extends');
require('es6-promise').polyfill();

require('./main.less');
require('current-platform/platform-init');

window.App = require('./application');

$(document).ready(function() {
  $('body').addClass(stormConfig.platform);

  App.bundleManager = new BundleManager({appId: stormConfig.appId});

  /* When running with a local bundle, bundle manager *MUST* be started before
   any other resources are loaded, so that paths can be resolved correctly if
   any resources have been updated through delta updates. */
  if (App.target === App.APP_TARGET_REMOTE) {
    App.bundleManager.init()
        .then(App.init)
        .then(appLoaded, appLoadError);
  } else {
    App.init().then(appLoaded, appLoadError);
  }

  $(document).on('click', '.CheckableListItemView', function() {
    var input = $(this).find('input')[0];

    input.checked = !input.checked;
    $(input).trigger('change');

    this.classList.add('highlight');

    $(this).one('animationend webkitAnimationEnd', function() {
      this.classList.remove('highlight');
    });
  });

  // Revert state on checkbox click so that parent event handler can update it.
  $(document).on('click', '.CheckableListItemView input', function() {
    this.checked = !this.checked;
  });

  var isIOS = navigator.userAgent.match(/(iPod|iPhone|iPad)/) !== null;

  if (isIOS || window.CSS && window.CSS.supports(MASK_SIZE)) {
    document.body.classList.add('mask-images');
  }
});

// Callback once app.json and manifest.json have loaded.
function appLoaded() {
  var lang = fetchLanguage(),
      data = fetchData();

  $.when(lang, data).then(startApp, appStartError);
}

function appLoadError() {
  console.error('Failed to load app or manifest JSON.');
}

// Load in a localisation JSON referenced in the manifest.
function fetchLanguage() {
  App.app.generateMap();
  App.manifest.generateMap();

  // Load in the closest language to what the browser wants.
  var lang = navigator.language.substr(0, 2);

  if (!App.manifest.map[lang]) {
    lang = Object.keys(App.manifest.map)[0];
  }

  if (lang) {
    App.language = new StormLanguage({lang: App.manifest.map[lang]});
    return App.language.fetch();
  }

  // No lang - running remotely.
  return $.when();
}

// Load in all JSON files referenced in the data section of the manifest.
function fetchData() {
  var requests = [];

  var datasets = App.manifest.get('data') || [];

  datasets.forEach(function(data) {
    var filename = data.src.slice(0, -5),
        model    = new StormData();

    model.url = App.bundleManager.getResourceUrl('bundle/data/' + data.src);

    App.data[filename] = model;
    requests.push(model.fetch());
  });

  return $.when.apply($, requests);
}

// All data loaded in - begin navigation.
function startApp() {
  Backbone.history.start({
    pushState: false
  });

  var isFirstLoad = localStorage.getItem('firstLoad') === null;

  if (isFirstLoad) {
    var onboardView = new OnboardView();

    $('body').append(onboardView.render().el);
    localStorage.setItem('firstLoad', 1);
  }
}

function appStartError() {
  console.error('Failed to load auxiliary data from manifest.');
}

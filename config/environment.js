/* jshint node: true */

module.exports = function(environment) {
  var ENV = {
    modulePrefix: 'bindfit-client',
    environment: environment,
    baseURL: '/',
    locationType: 'auto',
    
    // Root API URL
    API: {
      root: "http://api.supramolecular.org/bindfit/"
    },

    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      }
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    }
  };

  // API URL definitions
  ENV.API = {
    fit:     ENV.API.root+"fit",
    view:    ENV.API.root+"fit/",
    save:    ENV.API.root+"fit/save",
    list:    ENV.API.root+"list",
    labels:  ENV.API.root+"labels",
    options: ENV.API.root+"options",
    export:  ENV.API.root+"export",
    upload:  ENV.API.root+"upload"
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
    ENV.siteURL = "http://localhost:4200/bindfit/";
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.baseURL = '/';
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
  }

  if (environment === 'production') {
    ENV.siteURL = "http://app.supramolecular.org/bindfit/";
  }

  return ENV;
};

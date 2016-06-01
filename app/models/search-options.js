import Ember from 'ember';

import objectListFilter from '../helpers/object-list-filter';

export default Ember.Object.extend({
    // JSON of options to be sent
    fitter: null,

    data_id: "",

    params: Ember.computed('_paramsList', '_excludeParams', {
        // Computed property to return available unexcluded parameters
        get: function() {
            var paramsList    = this.get("_paramsList");
            var excludeParams = this.get("_excludeParams");

            var params = {};

            console.log("searchOptions.params: called");
            console.log("searchOptions.params: current _paramsList");
            console.log(paramsList);
            console.log("searchOptions.params: current _excludeParams");
            console.log(excludeParams);

            // If paramsList is not null and there are parameters to exclude
            if (paramsList && excludeParams) {
                // For each parameter
                for (var key in paramsList) {
                    // If param key is not excluded, append to params to return
                    if (excludeParams.indexOf(key) === -1) {
                        params[key] = paramsList[key];
                    }
                }
            } else {
                params = paramsList;
            }

            return params;
        }
    }),

    options: Ember.Object.extend({
        // Internal
        _flavourList:      null, // List of available flavours and their exclusions
        _flavourSelection: null,

        _methodList:       null, // List of available fitter methods
        _methodSelection:  null,

        flavour: Ember.computed('_flavourSelection', {
            get: function() {
                var selections = [];

                this.get('_flavourSelection').forEach(function(flavour) {
                    selections.push(flavour.key);
                });

                return selections;
            },
            set: function(key, value) {
                // Expects value to be an array of selections 
                var _this = this;

                if (_this.get('_flavourList')) {
                    var selections = [];
                    for (let i = 0; i < value.length; i++) {
                        // Get each flavour's full selection object referenced
                        // by name
                        let flavourKey = value[i];
                        selections.push(objectListFilter(_this.get('_flavourList'), 
                                                         "key", 
                                                         flavourKey));
                    }

                    _this.set('_flavourSelection', selections);
                } else {
                    // No flavours listed, set to empty
                    _this.set('_flavourSelection', null);
                }

                return value;
            }
        }),

        method: Ember.computed('_methodSelection', {
            get: function() {
                var selections = [];

                this.get('_methodSelection').forEach(function(method) {
                    selections.push(method.name);
                });

                return selections;
            },
            set: function(key, value) {
                // Expects value to be an array of selections 
                var _this = this;

                if (_this.get('_methodList')) {
                    var selections = [];
                    for (let i = 0; i < value.length; i++) {
                        // Get each method's full selection object referenced
                        // by name
                        let methodName = value[i];
                        selections.push(objectListFilter(_this.get('_methodList'), 
                                                         "name", 
                                                         methodName));
                    }

                    _this.set('_methodSelection', selections);
                } else {
                    // No methods listed, set to empty
                    _this.set('_methodSelection', null);
                }

                return value;
            }
        }),

        normalise: null,
        dilute: null
    }).create(),

    labels: null,



    // Internal
    // Keys to be parsed and stringified by _toJSON
    _jsonKeys:      ["fitter", 
                     "data_id", 
                     "params", 
                     {"options": ["flavour", 
                                  "method", 
                                  "normalise", 
                                  "dilute"]}, 
                     "labels"],

    _paramsList:    null, // Stores list of all available parameters
    _excludeParams: null, // Stores list of parameters to exclude from display
                         // and sending 
                         // (updated in fit-options-form.onOptionFlavourSelect)

    _setParamsLabelled: function(list) {
        /***
         * Manually set params from paramsLabelled computed property changes
         * Called by watchParamsLabelled observer in index controller
         */
        var _this = this;
        
        list.forEach(function(param) {
            _this.set("_paramsList."+param.key+".value", param.value); 
        });
    },

    _paramsLabelled: function(labels) {
        /***
         * Array of labelled parameters for display in template.
         * Note: getter only! Binding to object properties in array doesn't 
         * work w/ input helper. See workaround setter in setParamsLabelled.
         */

        var params        = this.get("params");

        // Null check
        if (!params) {
            return [];
        }

        console.log("searchOptions.paramsLabelled: called");
        console.log("searchOptions.paramsLabelled: labels");
        console.log(labels);
        console.log("searchOptions.paramsLabelled: params");
        console.log(params);

        var paramsArray = [];

        // Sort keys to display in order
        var sortedKeys = Object.keys(params).sort();

        // Populate parameter aray
        sortedKeys.forEach(function(key) {
            if (params.hasOwnProperty(key)) {
                // Ensure labels has been updated
                if (labels.hasOwnProperty(key)) {
                    paramsArray.push({
                        key:    key,
                        label:  labels[key].label,
                        units:  labels[key].units,
                        value:  params[key].value
                    });
                }
            }
        });

        return paramsArray;
    },

    _reset: function() {
        this.setProperties({
            fitter: null,
            data_id: "",
            options: null,

            _paramsList:    null,
            _excludeParams: null,
        });
    },

    _isPopulated: function() {
        console.log("searchOptions.isPopulated: called");
        console.log(this);
        return this.get("fitter");
    }.property("fitter", "data_id", "params", "options"),

    _hasData: function() {
        /***
         * Returns true if data has been uploaded
         */
        return this.get("data_id");
    }.property("fitter", "data_id"),

    _noFit: function() {
        /***
         * Returns true if no fit requested (save data only option)
         */

        // Check fitter isn't null
        if (this.get("fitter")) { 
            // If fitter name contains "data"
            if (this.get("fitter").indexOf("data") > -1) {
                // Save data only
                return true;
            } else {
                // Full fit
                return false;
            }
        }
    }.property("fitter"),

    _toJSON: function(noStringify) {
        console.log("searchOptions._toJSON: called");

        var _this = this;
        
        var json = {};
        _this.get("_jsonKeys").forEach(function(key) {
            if (typeof key === 'object') {
                // Hack to deal with nested Ember object for options
                Object.keys(key).forEach(function (k) {
                    json[k] = {};
                    key[k].forEach(function (subk) {
                        json[k][subk] = _this.get(k+"."+subk);
                    });
                });
            } else {
                json[key] = _this.get(key);
            }
        });
        
        console.log("searchOptions._toJSON: JSON to send");
        console.log(json);

        if (noStringify) {
            return json;
        } else {
            return JSON.stringify(json);
        }
    }
});

import Ember from 'ember';

export default Ember.Object.extend({
    // Options to be sent
    fitter: null,
    data_id: "",
    params: function() {
        // Computed property to return available unexcluded parameters

        var paramsList    = this.get("paramsList");
        var excludeParams = this.get("excludeParams");

        var params = {};

        // If paramsList is not null and there are parameters to exclude
        if (paramsList && excludeParams) {
            // For each parameter
            Object.keys(paramsList).forEach(function(key) {
                // If param key is not excluded, append to params to return
                if (excludeParams.indexOf(key) === -1) {
                    params[key] = paramsList[key];
                }
            });
        } else {
            params = paramsList;
        }

        return params;
    }.property("paramsList", "excludeParams"),
    labels: null,
    options: null,

    // Internal
    paramsList:    null, // Stores list of all available parameters
    excludeParams: null, // Stores list of parameters to exclude from display
                         // and sending 
                         // (updated in index.onOptionFlavourSelect)
    flavourList:   null, // List of available flavours and their exclusions

    setParamsLabelled: function(list) {
        /***
         * Manually set params from paramsLabelled computed property changes
         * Called by watchParamsLabelled observer in index controller
         */
        var _this = this;
        
        list.forEach(function(param) {
            _this.set("paramsList."+param.key, parseFloat(param.value)); 
        });
    },

    paramsLabelled: function(labels) {
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

        console.log("fitOptions.paramsLabelled: called");
        console.log("fitOptions.paramsLabelled: labels");
        console.log(labels);
        console.log("fitOptions.paramsLabelled: params");
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
                        key:   key,
                        label: labels[key].label,
                        units: labels[key].units,
                        value: params[key]
                    });
                }
            }
        });

        return paramsArray;
    },

    reset: function() {
        this.setProperties({
            fitter: null,
            data_id: "",
            options: null,

            paramList:     null,
            excludeParams: null,
            flavourList:   null,
        });
    },

    isPopulated: function() {
        return this.get("fitter");
    }.property("fitter", "data_id", "params", "options"),

    hasData: function() {
        /***
         * Returns true if data has been uploaded
         */
        return this.get("data_id");
    }.property("fitter", "data_id"),

    noFit: function() {
        /***
         * Returns true if no fit requested (save data only option)
         */
        // Check fitter isn't null
        if (this.get("fitter")) { 
            if (this.get("fitter").indexOf("data") > -1) {
                // Save data only
                return true;
            } else {
                // Full fit
                return false;
            }
        }
    }.property("fitter")
});

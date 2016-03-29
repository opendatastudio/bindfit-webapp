import Ember from 'ember';

export default Ember.Object.extend({
    fitter: null,
    data_id: "",
    params: null,
    labels: null,
    options: null,

    flavourList:   null,
    excludeParams: null,

    setParamsLabelled: function(list) {
        /***
         * Manually set params from paramsLabelled computed property changes
         * Called by watchParamsLabelled observer in index controller
         */
        var _this = this;
        
        list.forEach(function(param) {
            _this.set("params."+param.key, parseFloat(param.value)); 
        });
    },

    paramsLabelled: function(labels) {
        /***
         * Array of labelled parameters for display in template.
         * Note: getter only! Binding to object properties in array doesn't 
         * work w/ input helper. See workaround setter in setParamsLabelled.
         */
        var params        = this.get("params");
        var excludeParams = this.get("excludeParams");

        var paramsCut = {};

        // Null check
        if (excludeParams) {
            // For each parameter
            Object.keys(params).forEach(function(key) {
                // If param key is not in excluded array, append to paramsCut
                if (excludeParams.indexOf(key) === -1) {
                    paramsCut[key] = params[key];
                }
            });
        } else {
            paramsCut = params;
        }

        console.log("fitOptions.paramsLabelled: called");
        console.log("fitOptions.paramsLabelled: labels");
        console.log(labels);
        console.log("fitOptions.paramsLabelled: params");
        console.log(params);

        var paramsArray = [];

        // Sort keys to display in order
        var sortedKeys = Object.keys(paramsCut).sort();

        // Populate parameter aray
        sortedKeys.forEach(function(key) {
            if (paramsCut.hasOwnProperty(key)) {
                // Ensure labels has been updated
                if (labels.hasOwnProperty(key)) {
                    paramsArray.push({
                        key:   key,
                        label: labels[key].label,
                        units: labels[key].units,
                        value: paramsCut[key]
                    });
                }
            }
        });

        return paramsArray;
    },

    reset: function() {
        this.setProperties({
            fitter: null,
            params: null,
            data_id: "",
            options: null,

            flavourList: null,
            excludeParams: null
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

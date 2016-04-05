import Ember from 'ember';

export default Ember.Object.extend({
    // JSON of options to be sent
    fitter: null,
    data_id: "",
    params: function() {
        // Computed property to return available unexcluded parameters
        
        var paramsList    = this.get("_paramsList");
        var excludeParams = this.get("_excludeParams");

        var params = {};

        console.log("fitOptions.params: called");
        console.log("fitOptions.params: current _paramsList");
        console.log(paramsList);
        console.log("fitOptions.params: current _excludeParams");
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
    }.property("_paramsList", "_excludeParams"),
    labels: null,
    options: null,



    // Internal
    _paramsList:    null, // Stores list of all available parameters
    _excludeParams: null, // Stores list of parameters to exclude from display
                         // and sending 
                         // (updated in index.onOptionFlavourSelect)
    _flavourList:   null, // List of available flavours and their exclusions
    _methodList:    null, // List of available fitter methods

    _setParamsLabelled: function(list) {
        /***
         * Manually set params from paramsLabelled computed property changes
         * Called by watchParamsLabelled observer in index controller
         */
        var _this = this;
        
        list.forEach(function(param) {
            _this.set("_paramsList."+param.key+".init",   parseFloat(param.value)); 
            _this.set("_paramsList."+param.key+".bounds", param.bounds); 
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
                        key:    key,
                        label:  labels[key].label,
                        units:  labels[key].units,
                        value:  params[key].init,
                        bounds: params[key].bounds
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

            paramList:     null,
            excludeParams: null,
            flavourList:   null
        });
    },

    _isPopulated: function() {
        console.log("fitOptions.isPopulated: called");
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

    _toJSON: function() {
        console.log("fitOptions._toJSON: called");

        var _this = this;

        var json = {};
        for (var key in _this) {
            if (_this.hasOwnProperty(key)) {
                // If property is not internal (key starts with underscore), 
                // append to json to return
                if (key.lastIndexOf("_", 0) !== 0) {
                    json[key] = _this.get(key);
                }
            }
        }

        console.log("fitOptions._toJSON: JSON to send");
        console.log(json);

        return JSON.stringify(json);
    }
});

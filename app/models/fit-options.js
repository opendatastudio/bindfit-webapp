import Ember from 'ember';

export default Ember.Object.extend({
    fitter: null,
    data_id: "",
    params: null,
    labels: null,
    options: null,

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
        var params = this.get("params");

        console.log("fitOptions.paramsLabelled: called");
        console.log("fitOptions.paramsLabelled: labels");
        console.log(labels);
        console.log("fitOptions.paramsLabelled: params");
        console.log(params);

        var list = [];
        for (var key in params) {
            if (params.hasOwnProperty(key)) {
                // Ensure labels has been updated
                if (labels.hasOwnProperty(key)) {
                    list.push({
                        key:   key,
                        label: labels[key].label,
                        units: labels[key].units,
                        value: params[key]
                    });
                }
            }
        }

        return list;
    },

    reset: function() {
        this.setProperties({
            fitter: null,
            params: null,
            data_id: "",
            options: null
        });
    },

    isPopulated: function() {
        return (this.get("fitter") && this.get("params"));
    }.property("fitter", "data_id", "params", "options")
});

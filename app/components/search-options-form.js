import Ember from 'ember';

export default Ember.Component.extend({
    searchOptions: null,
    fitLabels:  null,

    didInsertElement: function() {
        this.get('controller').on('fitterSelect', Ember.$.proxy(this.initForm, this));
    },

    initForm: function() {
        // Initialise param labels
        this.setOptionsParamsLabelled();
    },

    optionsParamsLabelled: function() {
        /***
         * Array of labelled parameters for display in template, updated
         * by setOptionsParamsLabelled on each input change
         */
        var labels = this.get("fitLabels.fit.params");
        return this.searchOptions._paramsLabelled(labels);
    }.property("searchOptions.params", 
               "fitLabels.fit.params"),

    setOptionsParamsLabelled: function() {
        /***
         * Force Ember to manually call searchOptions._setParamsLabelled setter
         */
        var newParamsLabelled = this.get("optionsParamsLabelled");
        this.searchOptions._setParamsLabelled(newParamsLabelled);
        console.log("setOptionsParamsLabelled: params changed:");
        console.log(this.get("searchOptions.params"));
        console.log("setOptionsParamsLabelled: searchOptions:");
        console.log(this.get("searchOptions"));
        console.log("setOptionsParamsLabelled: searchOptions._toJSON:");
        console.log(this.get("searchOptions")._toJSON());
    },

    actions: {
        onOptionsParamsChange: function() {
            // Update parameters
            this.setOptionsParamsLabelled();
        }, // onOptionsParamsChange

        onOptionsFlavourSelect: function(selection) {
            // Set selected flavour key in options object to be sent
            console.log("actions.onOptionsFlavourSelect: flavour selected");
            console.log(selection);
            
            // Construct list of flavour keys to be set
            // And concatenate their associated parameter exclusions
            var flavours = [];
            var excludeParams = [];
            selection.forEach(function(flavour) {
                flavours.push(flavour.key);
                if (flavour.hasOwnProperty('exclude_params')) {
                    excludeParams = excludeParams.concat(flavour.exclude_params);
                }
            });

            // Set flavour selections
            this.set("searchOptions.options.flavour", flavours);

            console.log("actions.onOptionsFlavourSelect: set selected flavours");
            console.log(flavours);
            console.log(this.get("searchOptions.options.flavour"));

            // Set parameter exclusions
            this.set("searchOptions._excludeParams", excludeParams);

            console.log("actions.onOptionsFlavourSelect: set excluded params");
            console.log(excludeParams);
            console.log(this.get("searchOptions._excludeParams"));
        }, // onOptionsFlavourSelect

        onOptionsMethodSelect: function(selection) {
            // Construct list of method keys to be set
            var methods = [];
            selection.forEach(function(method) {
                methods.push(method.name);
            });

            // Set selected method keys in options object
            this.set("searchOptions.options.method", methods);

            console.log("actions.onOptionsMethodSelect: set selected method");
            console.log(methods);
            console.log(this.get("searchOptions.options.method"));
        }, // onOptionsMethodSelect
    },
});

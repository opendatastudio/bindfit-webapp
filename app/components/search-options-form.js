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
            
            this.set("searchOptions.options.flavour", selection.key);

            console.log("actions.onOptionsFlavourSelect: set selected flavour");
            console.log(this.get("searchOptions.options._flavourSelection"));
            console.log(this.get("searchOptions.options.flavour"));

            // If this flavour has restricted parameters, set them to be
            // excluded from displaying and sending in searchOptions
            if (selection.hasOwnProperty("exclude_params")) {
                this.set("searchOptions._excludeParams",   
                         selection.exclude_params);
                
                console.log("actions.onOptionsFlavourSelect: set excluded params");
                console.log(this.get("searchOptions._excludeParams"));
            } else {
                // Reset excluded params
                this.set("searchOptions._excludeParams", null);

                console.log("actions.onOptionsFlavourSelect: reset excluded params");
                console.log(this.get("searchOptions._excludeParams"));
            }
        }, // onOptionsFlavourSelect

        onOptionsMethodSelect: function(selection) {
            // Set selected method key in options object to be sent
            this.set("searchOptions.options.method", selection.name);

            console.log("actions.onOptionsMethodSelect: set selected method");
            console.log(this.get("searchOptions.options.method"));
        }, // onOptionsMethodSelect
    },
});

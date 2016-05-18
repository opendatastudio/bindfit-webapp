import Ember from 'ember';

export default Ember.Component.extend({
    fitOptions: null,
    fitLabels: null,

    didInsertElement: function() {
        this.get('controller').on('fitterSelect', $.proxy(this.initForm, this));
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
        return this.fitOptions._paramsLabelled(labels);
    }.property("fitOptions.params", 
               "fitLabels.fit.params"),

    setOptionsParamsLabelled: function() {
        /***
         * Force Ember to manually call fitOptions._setParamsLabelled setter
         */
        var newParamsLabelled = this.get("optionsParamsLabelled");
        this.fitOptions._setParamsLabelled(newParamsLabelled);
        console.log("setOptionsParamsLabelled: params changed:");
        console.log(this.get("fitOptions.params"));
        console.log("setOptionsParamsLabelled: fitOptions:");
        console.log(this.get("fitOptions"));
        console.log("setOptionsParamsLabelled: fitOptions._toJSON:");
        console.log(this.get("fitOptions")._toJSON());
    },

    actions: {
        onOptionsParamsChange: function() {
            // Update parameters
            this.setOptionsParamsLabelled();
        }, // onOptionsParamsChange

        onOptionsFlavourSelect: function(selection) {
            // Set selected flavour key in options object to be sent
            this.set("fitOptions.options.flavour", selection.key);

            console.log("actions.onOptionsFlavourSelect: set selected flavour");
            console.log(this.get("fitOptions.options.flavour"));

            // If this flavour has restricted parameters, set them to be
            // excluded from displaying and sending in fitOptions
            if (selection.hasOwnProperty("exclude_params")) {
                this.set("fitOptions._excludeParams",   
                         selection.exclude_params);
                
                console.log("actions.onOptionsFlavourSelect: set excluded params");
                console.log(this.get("fitOptions._excludeParams"));
            } else {
                // Reset excluded params
                this.set("fitOptions._excludeParams", null);

                console.log("actions.onOptionsFlavourSelect: reset excluded params");
                console.log(this.get("fitOptions._excludeParams"));
            }
        }, // onOptionsFlavourSelect

        onOptionsMethodSelect: function(selection) {
            // Set selected method key in options object to be sent
            this.set("fitOptions.options.method", selection.name);

            console.log("actions.onOptionsMethodSelect: set selected method");
            console.log(this.get("fitOptions.options.method"));
        }, // onOptionsMethodSelect
    },
});

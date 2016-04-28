import Ember from 'ember';
import ENV from 'bindfit-client/config/environment';

export default Ember.Controller.extend({
    // Bind optional query parameter for fit edit key
    queryParams: ["key"],
    key: null,

    // Currently selected fitter
    activeFitter: null,

    // Currently selected tab
    activeTab: 1,

    optionsParamsLabelled: function() {
        /***
         * Array of labelled parameters for display in template, updated
         * by setOptionsParamsLabelled on each input change
         */
        var labels = this.get("model.fitLabels.fit.params");
        return this.model.fitOptions._paramsLabelled(labels);
    }.property("model.fitOptions.params", 
               "model.fitLabels.fit.params"),

    setOptionsParamsLabelled: function() {
        /***
         * Force Ember to manually call fitOptions._setParamsLabelled setter
         */
        var newParamsLabelled = this.get("optionsParamsLabelled");
        this.model.fitOptions._setParamsLabelled(newParamsLabelled);
        console.log("setOptionsParamsLabelled: params changed:");
        console.log(this.get("model.fitOptions.params"));
        console.log("setOptionsParamsLabelled: fitOptions:");
        console.log(this.get("model.fitOptions"));
        console.log("setOptionsParamsLabelled: fitOptions._toJSON:");
        console.log(this.get("model.fitOptions")._toJSON());
    },

    actions: {
        selectTab: function(selection) {
            var controller = this;
            console.log("actions.selectTab: called");
            controller.set('activeTab', selection);
        },

        prevTab: function() {
            var controller = this;
            var tab = controller.get('activeTab');
            tab--;
            controller.set('activeTab', tab);
        },

        nextTab: function() {
            var controller = this;
            console.log("actions.nextTab: called");
            var tab = controller.get('activeTab');
            tab++;
            controller.set('activeTab', tab);
        },

        onFitterSelect: function(selection) {
            /*** 
             * On fitter select, populate fitOptions and fitLabels models
             * based on selection
             */

            console.log("actions.onFitterSelect: called");
            console.log("actions.onFitterSelect: selection");
            console.log(selection);

            var controller = this;

            // Clear any previous fit results, exports and saves
            controller.get('model.fitResult').reset();
            controller.get('model.fitExport').reset();
            //controller.get('model.fitOptions').reset();
            controller.get('model.fitSave').reset();

            // If a fitter is selected (not undefined)
            // Pre-populate fitOptions and fitLabels for this selection
            if (selection !== undefined) {
                console.log("actions.onFitterSelect: selection !== undefined");

                controller.set('activeFitter', selection.name);

                var request = {"fitter": selection.key};

                var promises = {
                    labels: Ember.$.ajax({
                        url:  ENV.API.labels,
                        type: "POST",
                        data: JSON.stringify(request),
                        contentType: "application/json; charset=utf-8",
                        dataType:    "json"}),
                    options: Ember.$.ajax({
                        url:  ENV.API.options,
                        type: "POST",
                        data: JSON.stringify(request),
                        contentType: "application/json; charset=utf-8",
                        dataType:    "json"})
                };

                Ember.RSVP.hash(promises).then(function(hash) {
                    controller.model.fitLabels.setProperties(hash.labels);

                    // Carry over options.data_id to save any previously 
                    // uploaded data file
                    var data_id = controller.model.fitOptions.data_id;

                    // Save list of available flavour options and remove from 
                    // main options json to be sent
                    var flavourList = hash.options.options.flavour;
                    hash.options.options.flavour = "";

                    // Save list of available method options and remove from 
                    // main options json to be sent
                    var methodList = hash.options.options.method;
                    hash.options.options.method = "";

                    // Save list of available parameters and remove from 
                    // main options json to be sent
                    var paramsList  = hash.options.params;
                    delete hash.options.params;

                    console.log("Attempting setProperties");
                    console.log(controller.get("model.fitOptions"));
                    controller.model.fitOptions.setProperties(hash.options);
                    controller.set("model.fitOptions.data_id",      data_id);
                    controller.set("model.fitOptions._flavourList", flavourList);
                    controller.set("model.fitOptions._methodList",  methodList);
                    controller.set("model.fitOptions._paramsList",  paramsList);

                    // Initialise labelled parameter array
                    controller.setOptionsParamsLabelled();

                    console.log("actions.onFitterSelect: RSVP succeeded");
                    console.log("actions.onFitterSelect: hash.options to be set via setProperties:");
                    console.log(hash.options);
                    console.log("actions.onFitterSelect: fitLabels and fitOptions set");
                    console.log(controller.get("model.fitLabels"));
                    console.log(controller.get("model.fitOptions"));
                    
                    // Advance to Control tab
                    controller.send('nextTab');
                });
            }
        }, // onFitterSelect

        onOptionsParamsChange: function() {
            // Update parameters
            this.setOptionsParamsLabelled();
        }, // onOptionsParamsChange

        onOptionFlavourSelect: function(selection) {
            // Set selected flavour key in options object to be sent
            this.set("model.fitOptions.options.flavour", selection.key);

            console.log("actions.onOptionFlavourSelect: set selected flavour");
            console.log(this.get("model.fitOptions.options.flavour"));

            // If this flavour has restricted parameters, set them to be
            // excluded from displaying and sending in fitOptions
            if (selection.hasOwnProperty("exclude_params")) {
                this.set("model.fitOptions._excludeParams",   
                         selection.exclude_params);
                
                console.log("actions.onOptionFlavourSelect: set excluded params");
                console.log(this.get("model.fitOptions._excludeParams"));
            } else {
                // Reset excluded params
                this.set("model.fitOptions._excludeParams", null);

                console.log("actions.onOptionFlavourSelect: reset excluded params");
                console.log(this.get("model.fitOptions._excludeParams"));
            }
        }, // onOptionFlavourSelect

        onOptionsMethodSelect: function(selection) {
            // Set selected method key in options object to be sent
            this.set("model.fitOptions.options.method", selection.name);

            console.log("actions.onOptionsMethodSelect: set selected method");
            console.log(this.get("model.fitOptions.options.method"));
        }, // onOptionsMethodSelect

        onUploadComplete: function(response) {
            console.log("actions.onUploadComplete: called");
            // Reset fit result
            this.get("model.fitResult").reset();
            console.log("actions.onUploadComplete: fitResult reset");
            // Set unique file id in fitOptions
            this.set('model.fitOptions.data_id', response.data_id);
            // Save parsed data in fitResult
            this.model.fitResult.setProperties(response);

            console.log("actions.onUploadComplete: Updated fitResult");
            console.log(this.get("model.fitResult"));
            console.log("actions.onUploadComplete: Updated fitOptions.data_id");
            console.log(this.get("model.fitOptions.data_id"));

            if (this.get('model.fitOptions.noFit')) {
                // If no fit requested, trigger save data action
                this.send('saveData');
            }
        },

        onUploadRestart: function() {
            console.log("actions.onUploadRestart: called");

            // Clear any previous fit results and exports
            // Retain options
            this.get('model.fitResult').reset();
            this.get('model.fitExport').reset();
            this.get('model.fitSave').reset();
        },

        runFitter: function(callback) {
            // Clear any previous fit results and exports
            // Retain options
            this.get('model.fitResult').reset();
            this.get('model.fitExport').reset();
            this.get('model.fitSave').reset();

            var controller = this;

            console.log("actions.runFitter: called");
            console.log("actions.runFitter: current fitOptions TO SEND");
            console.log(controller.get("model.fitOptions"));

            var promise = new Ember.RSVP.Promise(function(resolve, reject) {
                Ember.$.ajax({
                    url:  ENV.API.fit,
                    type: "POST",
                    data: controller.get("model.fitOptions")._toJSON(),
                    contentType: "application/json; charset=utf-8",
                    dataType:    "json"
                })
                .done(resolve)
                .fail(reject);
            });

            // For async button
            callback(promise);

            promise.then(
            function(data) {
                console.log("actions.runFitter: $.ajax: bindfit call success");
                console.log(data);

                // Set fit model properties with returned JSON
                controller.model.fitResult.setProperties(data);

                console.log("actions.runFitter: $.ajax: fit model properties set");
                console.log(controller.model.fitResult);

                // Advance to Results tab
                controller.send('nextTab');
            },
            function(error) {
                console.log("actions.runFitter: $.ajax: bindfit call failed");
                console.log(error);
            });
        }, // runFitter

        saveData: function() {
            // Clear any previous fit saves and exports
            this.get('model.fitExport').reset();
            this.get('model.fitSave').reset();

            var controller = this;

            console.log("actions.saveData: called");

            // Set no_fit option flag in fitResult to be sent
            this.set('model.fitResult.no_fit', true);

            // Set appropriate fitResult properties to save 
            var fitter  = this.get('model.fitOptions.fitter');
            var data_id = this.get('model.fitOptions.data_id');

            this.set('model.fitResult.fitter',  fitter);
            this.set('model.fitResult.data_id', data_id);

            // Advance to Save tab
            controller.send('selectTab', 4);
        } // saveData



    }, // actions
});

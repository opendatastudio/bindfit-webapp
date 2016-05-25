import Ember from 'ember';
import ENV from 'bindfit-client/config/environment';

export default Ember.Controller.extend(Ember.Evented, {
    // Bind optional query parameter for fit edit key
    queryParams: ["key"],
    key: null,

    // Currently selected fitter
    activeFitter: null,

    // Currently selected tab
    activeTab: 1,

    // Pagination
    NUMBER_ROWS_PAGE: 5,
    currentPage: 1,
    countPages: 0, // set onUploadComplete
    // so. where to begin?     

    // TODO generalise for everything, really
    pagedFitResults: function() {
        this.debug("pagedFitResults: helloWorld");
        var _this = this; 
        var currentPage = _this.get("currentPage");
        var fitResult = _this.get("model.fitResult");

        this.debug("fitResult", fitResult);
        var countPages = _this.get("countPages");
        var n = _this.get("NUMBER_ROWS_PAGE");

        var startIndex = (currentPage-1)*n; 
        var endIndex = startIndex + n; // +1 ?? 
      
        

        if (!fitResult.labels.data.y) { 
            return fitResult;
        }

        var paged = JSON.parse(JSON.stringify(fitResult)); 

        paged["labels"]["data"]["y"]["row_labels"] = 
            fitResult.labels.data.y.row_labels.slice(startIndex,endIndex);
       
        paged["data"]["y"] = 
            fitResult.data.y.slice(startIndex,endIndex);
        
        paged["data"]["x"] = 
            fitResult.data.x.slice(startIndex,endIndex);
       
        if (fitResult.qof.residuals) {
            paged["qof"]["residuals"]= 
              fitResult.qof.residuals.slice(startIndex, endIndex);
        }

        if (fitResult.fit.y) {
            paged["fit"]["y"] = 
                fitResult.fit.y.slice(startIndex,endIndex);
        }

        return paged;
    }.property("model.fitResult.fit.y", "currentPage", "countPages"),


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

    initBootstrapTooltip: function() {
      // TODO
      // technical debt; this is horribly expensive
      Ember.$('body').tooltip({
        selector: '[data-toggle=tooltip]'
      });
    }.on("init"),

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

        onFitterSelect: function(selection, fitResult) {
            /*** 
             * On fitter select, populate fitOptions and fitLabels models
             * based on selection.
             *
             * If fitOptions provided as an argument, this function sets the 
             * current application state to match the passed fitOptions object.
             * Used by edit route to initialise fitter with existing fit.
             */

            console.log("actions.onFitterSelect: called");
            console.log("actions.onFitterSelect: selection");
            console.log(selection);

            var controller = this;

            // Clear any previous fit results, exports and saves
            // if (lemon) document.write("foo gave me a bar");
            if (controller.get('model.fitResult')) {controller.get('model.fitResult').reset();}
            if (controller.get('model.fitExport')) {controller.get('model.fitExport').reset();}
            //controller.get('model.fitOptions').reset();
            if (controller.get('model.fitSave')) {controller.get('model.fitSave').reset();}

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
                    var data_id     = null;
                    var flavourList = null;
                    var methodList  = null;
                    var paramsList  = null;

                    // Save lists of available options
                    flavourList = hash.options.options.flavour;
                    methodList  = hash.options.options.method;
                    paramsList  = hash.options.params;

                    if (fitResult === undefined) {
                        // Carry over options.data_id to save any previously 
                        // uploaded data file
                        data_id = controller.model.fitOptions.data_id;

                        // Select default options
                        hash.options.options.flavour = "";
                        hash.options.options.method = 'Nelder-Mead';
                        delete hash.options.params; // Computed from paramsList
                    } else {
                        console.log("actions.onFitterSelect: FITRESULT GIVEN");
                        console.log(fitResult);

                        data_id = fitResult.data_id;

                        // Overwrite selections with retrieved options
                        hash.options.fitter  = fitResult.fitter;
                        hash.options.options = fitResult.options;
                        delete hash.options.params;

                        // Extend pre-set options in paramsList with
                        // retrieved param values 
                        console.log("paramsList before extend");
                        console.log(paramsList);
                        paramsList = Ember.$.extend(hash.options.params, fitResult.fit.params);
                        console.log("paramsList after extend");
                        console.log(paramsList);
                    }

                    console.log("Setting retrieved properties");
                    console.log(controller.get("model.fitOptions"));

                    // Populate selection lists
                    controller.set("model.fitOptions.options._flavourList", flavourList);
                    controller.set("model.fitOptions.options._methodList",  methodList);
                    controller.set("model.fitOptions._paramsList",  paramsList);

                    // Set options manually as nested object to avoid 
                    // overwriting computed props
                    controller.model.fitOptions.set('options.flavour', hash.options.options.flavour);
                    controller.model.fitOptions.set('options.method', hash.options.options.method);
                    controller.model.fitOptions.set('options.normalise', hash.options.options.normalise);
                    controller.model.fitOptions.set('options.dilute', hash.options.options.dilute);

                    delete hash.options.options;

                    // Set rest of properties in bulk
                    controller.model.fitOptions.setProperties(hash.options);

                    // Set any previously uploaded files
                    controller.set("model.fitOptions.data_id",      data_id);

                    // Trigger options form init 
                    controller.trigger('fitterSelect');

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


            // move elsewhere
            // hi, this is wrong!
            var numberFits = this.get("model.fitResult.data.y").length;

            var NUMBER_ROWS_PAGE = this.get("NUMBER_ROWS_PAGE");
            var numberPages = parseInt(numberFits / NUMBER_ROWS_PAGE, 10);

            // TODO hi this is extremely wrong
            this.set("countPages", numberPages);
            // end move elsewhere


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

// vim: set ts=4:

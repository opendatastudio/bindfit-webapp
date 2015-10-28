import Ember from 'ember';
import {defaultChartTheme, 
        genChartData, 
        genChartDataResiduals,
        genChartOptions} from '../helpers/bindfit-high-charts';

// Constants?
var root = "http://api.supramolecular.echus.co/bindfit/";

export default Ember.Controller.extend({
    // Limit number of fits to plot
    // TEMP TODO: move this to a constants file
    PLOT_LIMIT: 8,

    // Highcharts theme
    chartTheme: defaultChartTheme,

    // Highcharts data munging
    // Wrapper anon functions used to get "this" reference to controller model 
    // values, I'm lazy
    // TODO: figure out how to access current controller values from top-level?
    chartData: function() {
        return genChartData(
            this.get("model.fitResult.data"),
            this.get("model.fitResult.fit"),
            this.get("model.fitLabels"),
            this.get("PLOT_LIMIT"));
                                                  // Observes only one prop in
                                                  // labels, assuming all props
                                                  // are updated simultaneously
    }.property("model.fitResult.data", "model.fitResult.fit", "model.fitLabels.x"),

    chartDataResiduals: function() {
        return genChartDataResiduals(
            this.get("model.fitResult.data"),
            this.get("model.fitResult.fit"),
            this.get("model.fitLabels"),
            this.get("PLOT_LIMIT"));
    }.property("model.fitResult.data", "model.fitResult.fit", "model.fitLabels.x"),

    chartOptions: function() {
        return genChartOptions(this.get("model.fitLabels"));
    }.property("model.fitLabels.x"),



    actions: {
        onFitterSelect: function(selection) {
            /*** 
             * On fitter select, populate fitOptions and fitLabels models
             * based on selection
             */

            console.log("actions.onFitterSelect: called");
            console.log("actions.onFitterSelect: selection");
            console.log(selection);

            var controller = this;

            // Clear any previous fit options, results and exports
            controller.get('model.fitResult').reset();
            //controller.get('model.fitOptions').reset();
            controller.get('model.fitExport').reset();
            controller.get('model.fitSave').reset();

            // If a fitter is selected (not undefined)
            // Populate fitOptions and fitLabels
            if (selection !== undefined) {
                console.log("actions.onFitterSelect: selection !== undefined");

                var request = {"fitter": selection};

                var promises = {
                    labels: Ember.$.ajax({
                        url:  root+"labels",
                        type: "POST",
                        data: JSON.stringify(request),
                        contentType: "application/json; charset=utf-8",
                        dataType:    "json"}),
                    options: Ember.$.ajax({
                        url:  root+"options",
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
                    controller.model.fitOptions.setProperties(hash.options);
                    controller.set("model.fitOptions.data_id", data_id);

                    console.log("actions.onFitterSelect: RSVP succeeded");
                    console.log("actions.onFitterSelect: fitLables and fitOptions set");
                    console.log(controller.get("model.fitLabels"));
                    console.log(controller.get("model.fitOptions"));
                });
            }
        }, // onFitterSelect

        onUploadComplete: function(details) {
            // Set unique file id in fitOptions
            this.set('model.fitOptions.data_id', details.id);

            console.log("actions.onUploadComplete: called");
            console.log("actions.onUploadComplete: Updated fitOptions.data_id");
            console.log(this.get("model.fitOptions.data_id"));
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
                    url:  root+"fit",
                    type: "POST",
                    data: JSON.stringify(controller.get("model.fitOptions")),
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
            },
            function(error) {
                console.log("actions.runFitter: $.ajax: bindfit call failed");
                console.log(error);
            });
        } // runFitter
    }, // actions
});

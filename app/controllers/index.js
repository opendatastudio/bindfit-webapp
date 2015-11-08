import Ember from 'ember';
import {defaultChartTheme, 
        genChartData, 
        genChartDataLinked, 
        genChartOptionsTEMP,
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
    chartDataFit: function() {
            // plotlimit = this.get("PLOT_LIMIT"));
            var geq = this.get("model.fitResult.geq");
            var data = this.get("model.fitResult.data.y");
            var fit = this.get("model.fitResult.fit.y");

            var labels = this.get("model.fitResult.labels");

            // If data has been populated, plot only data
            if (geq && data && !fit) {
                return genChartData(
                    geq,
                    data,
                    labels.data.y.row_labels,
                    "",
                    labels.data.x.axis_label,
                    labels.data.y.axis_label,
                    labels.data.x.axis_units,
                    labels.data.y.axis_units,
                    "line",
                    true,
                    2);
            }
            // If fit has been populated
            else if (geq && data && fit) {
                return genChartDataLinked(
                    geq,
                    data, fit,
                    labels.data.y.row_labels, ["temp", "temp", "temp", "temp"],
                    "", "fit",
                    labels.data.x.axis_label, labels.fit.y.axis_label,
                    labels.data.x.axis_units, labels.fit.y.axis_units,
                    "line", true, 0,
                    "spline", false, 2);
            }

                                                  // Observes only one prop in
                                                  // labels, assuming all props
                                                  // are updated simultaneously
    }.property("model.fitResult.geq", "model.fitResult.data.y", "model.fitResult.fit.y"),

    chartDataResiduals: function() {
        // plotlimit = this.get("PLOT_LIMIT"));
        var geq = this.get("model.fitResult.geq");
        var residuals = this.get("model.fitResult.qof.residuals");

        var labels = this.get("model.fitResult.labels");

        // If data has been populated, plot only data
        if (geq && residuals) {
            return genChartData(
                geq,
                residuals,
                labels.data.y.row_labels,
                "residuals",
                labels.data.x.axis_label,
                labels.fit.y.axis_label,
                labels.data.x.axis_units,
                labels.fit.y.axis_units,
                "line",
                true,
                2);
        }
    }.property("model.fitResult.geq", "model.fitResult.qof.residuals"),

    chartOptionsFit: function() {
        console.log("chartOptionsFit: called");
        var labels = this.get("model.fitResult.labels");
        console.log("chartOptionsFit: labels.data");
        console.log(labels.data);
        if (labels.data) {
            console.log("chartOptionsFit: updating ...");
            return genChartOptions(labels.data.x.axis_label,
                                   labels.data.y.axis_label,
                                   labels.data.x.axis_units,
                                   labels.data.y.axis_units);
        };
    }.property("model.fitResult.labels.data.x.axis_label",
               "model.fitResult.labels.data.y.axis_units",
               "model.fitResult.labels.data.x.axis_label",
               "model.fitResult.labels.data.y.axis_units"),

    chartDataMolefrac: function() {
        var geq = this.get("model.fitResult.geq");
        var molefrac = this.get("model.fitResult.fit.molefrac");

        // If model has been populated
        if (geq && molefrac) {
            return genChartData(
                geq,
                molefrac,
                ["H", "HG", "HG2"],
                "molefraction",
                this.get("model.fitResult.labels.data.x.axis_label"),
                "Molefraction",
                this.get("model.fitResult.labels.data.x.axis_units"),
                "",
                "spline",
                false,
                2);
        }
    }.property("model.fitResult.geq", "model.fitResult.fit.molefrac"),

    chartOptionsMolefrac: function() {
        var labels = this.get("model.fitResult.labels");
        if (labels.data) {
            return genChartOptions(labels.data.x.axis_label,
                                   "Molefraction",
                                   labels.data.x.axis_units,
                                   "");
        };
    }.property("model.fitResult.labels.data.x.axis_label",
               "model.fitResult.labels.data.x.axis_label"),

    watchParamsLabelled: function() {
        // Force Ember to manually call fitOptions.paramsLabelled's setter when
        // a user updates a parameter's value
        var newParamsLabelled = this.get("model.fitOptions.paramsLabelled");
        this.model.fitOptions.setParamsLabelled(newParamsLabelled);
        console.log("watchParamsLabelled: params changed:");
        console.log(this.model.fitOptions.params);
    }.observes("model.fitOptions.paramsLabelled.@each.value"),

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

        onUploadComplete: function(response) {
            console.log("actions.onUploadComplete: called");
            // Set unique file id in fitOptions
            this.set('model.fitOptions.data_id', response.data_id);
            // Save parsed data in fitResult
            this.model.fitResult.setProperties(response);

            console.log("actions.onUploadComplete: Updated fitResult");
            console.log(this.get("model.fitResult"));
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

import Ember from 'ember';
import ChartTheme from '../themes/bindfit-high-charts';

// Constants?
var root = "http://api.supramolecular.echus.co/bindfit/";

export default Ember.Controller.extend({
    // Limit number of fits to plot
    // TEMP TODO: move this to a constants file
    PLOT_LIMIT: 8,

    // Highcharts theme
    chartTheme: ChartTheme,



    // Computed properties for Highcharts data munging and chart series 
    // formatting
    chartData: function() {
        // Generate Highcharts series formatted fit data

        var series = [];
        var i = 0;

        var d = this.get("fitResult.data");
        var f  = this.get("fitResult.fit");
            
        // If model has been populated
        if (d && f) {
            var data_y = d.y[0];
            var fit_y  = f.y[0];
            
            // Assume all data and fits match data.y[0] length
            // TODO if not throw error
            var y_len  = data_y.length;
            if (y_len > this.PLOT_LIMIT) {
                y_len = this.PLOT_LIMIT;
            }

            // Calculate geq for x axis
            var data_x = [];
            var h0 = d.x[0];
            var g0 = d.x[1];
            for (i = 0; i < g0.length; i++) {
                data_x.push(g0[i]/h0[i]);
            }

            // Temporary storage for each series added to chart
            var data_series = [];
            var fit_series  = [];

            // For each observation
            for (var obs = 0; obs < y_len; obs++) {
                data_series = [];
                fit_series = [];

                // Create [[geq, y], [geq, y]...] array for each obs 
                // For each point in current observation
                for (i = 0; i < data_x.length; i++) {
                    data_series.push([data_x[i], data_y[obs][i]]);
                    fit_series.push([data_x[i], fit_y[obs][i]]);
                }

                series.push({
                    name: "Data "+String(obs+1),
                    type: "line",
                    marker: {enabled: true},
                    lineWidth: 0,
                    data: data_series
                });

                series.push({
                    name: "Fit "+String(obs+1),
                    type: "spline",
                    marker: {enabled: false},
                    lineWidth: 2,
                    data: fit_series 
                });
            }
        }

        console.log("FitOptions.chartData: chartData computed");
        console.log(series);

        return series;
    }.property("fitResult.data", "fitResult.fit"),

    chartDataResiduals: function() {
        // Generate Highcharts series formatted fit residual data

        var series = [];
        var i = 0;

        var d = this.get("fitResult.data");
        var f  = this.get("fitResult.fit");
            
        // If model has been populated
        if (d && f) {

            // Only use first dataset
            var y = f.residuals[0];
            
            // Limit plot length
            var y_len  = y.length;
            if (y_len > this.PLOT_LIMIT) {
                y_len = this.PLOT_LIMIT;
            }

            // Calculate geq for x axis
            var x  = [];
            var h0 = d.x[0];
            var g0 = d.x[1];
            for (i = 0; i < g0.length; i++) {
                x.push(g0[i]/h0[i]);
            }

            // Temporary storage for each series added to chart
            var obs_series  = [];

            // For each observation
            for (var obs = 0; obs < y_len; obs++) {
                obs_series = [];

                // Create [[geq, y], [geq, y]...] array for each obs 
                // For each point in current observation
                for (i = 0; i < x.length; i++) {
                    obs_series.push([x[i], y[obs][i]]);
                }

                series.push({
                    name: "Residuals "+String(obs+1),
                    type: "line",
                    marker: {enabled: true},
                    lineWidth: 2,
                    data: obs_series
                });
            }
        }

        console.log("FitOptions.chartDataResiduals: chartDataResiduals computed");
        console.log(series);

        return series;
    }.property("fitResult.data", "fitResult.fit"),



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
            controller.get('fitResult').reset();
            controller.get('fitOptions').reset();
            controller.get('fitExport').reset();
            controller.get('fitSave').reset();

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
                    controller.fitLabels.setProperties(hash.labels);
                    controller.fitOptions.setProperties(hash.options);
                    console.log("actions.onFitterSelect: RSVP succeeded");
                    console.log("actions.onFitterSelect: fitLables and fitOptions set");
                    console.log(controller.get("fitLabels"));
                    console.log(controller.get("fitOptions"));
                });
            }
        }, // onFitterSelect

        onUploadComplete: function(details) {
            // Set unique file id in fitOptions
            this.set('fitOptions.data_id', details.id);

            console.log("actions.onUploadComplete: called");
            console.log("actions.onUploadComplete: Updated fitOptions.data_id");
            console.log(this.get("fitOptions.data_id"));
        },

        onUploadRestart: function() {
            console.log("actions.onUploadRestart: called");

            // Clear any previous fit results and exports
            // Retain options
            this.get('fitResult').reset();
            this.get('fitExport').reset();
            this.get('fitSave').reset();
        },

        runFitter: function(callback) {
            // Clear any previous fit results and exports
            // Retain options
            this.get('fitResult').reset();
            this.get('fitExport').reset();
            this.get('fitSave').reset();

            var controller = this;

            console.log("actions.runFitter: called");
            console.log("actions.runFitter: current fitOptions TO SEND");
            console.log(controller.get("fitOptions"));

            var promise = new Ember.RSVP.Promise(function(resolve, reject) {
                Ember.$.ajax({
                    url:  root+"fit",
                    type: "POST",
                    data: JSON.stringify(controller.get("fitOptions")),
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
                controller.fitResult.setProperties(data);

                console.log("actions.runFitter: $.ajax: fit model properties set");
                console.log(controller.fitResult);
            },
            function(error) {
                console.log("actions.runFitter: $.ajax: bindfit call failed");
                console.log(error);
            });
        } // runFitter
    }, // actions
});

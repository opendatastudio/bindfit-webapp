import Ember from 'ember';
import {defaultChartTheme, 
        genChartData, 
        genChartDataLinked, 
        genChartOptions} from '../helpers/bindfit-high-charts';

export default Ember.Component.extend({
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
        var plot_limit = this.get("PLOT_LIMIT");

        var geq = this.get("fitResult.geq");
        var data = this.get("fitResult.data.y");
        var fit = this.get("fitResult.fit.y");

        var labels = this.get("fitLabels");
        var user_labels = this.get("fitResult.labels");

        // If data has been populated, plot only data
        if (geq && data && !fit) {
            return genChartData(
                geq,
                data,
                user_labels.data.y.row_labels,
                "",
                labels.data.x.axis_label,
                labels.data.y.axis_label,
                labels.data.x.axis_units,
                labels.data.y.axis_units,
                "line",
                true,
                2,
                plot_limit);
        }
        // If fit has been populated
        else if (geq && data && fit) {
            return genChartDataLinked(
                geq,
                data, fit,
                user_labels.data.y.row_labels, user_labels.data.y.row_labels,
                "", "fit",
                labels.data.x.axis_label, labels.fit.y.axis_label,
                labels.data.x.axis_units, labels.fit.y.axis_units,
                "line", true, 0,
                "spline", false, 2,
                plot_limit);
        }

                                                  // Observes only one prop in
                                                  // labels, assuming all props
                                                  // are updated simultaneously
    }.property("fitResult.geq", "fitResult.data.y", "fitResult.fit.y"),

    chartDataResiduals: function() {
        console.log("COMPONENT fit-charts chartDataResiduals: called");
        var plot_limit = this.get("PLOT_LIMIT");

        // plotlimit = this.get("PLOT_LIMIT"));
        var geq = this.get("fitResult.geq");
        var residuals = this.get("fitResult.qof.residuals");

        var labels = this.get("fitLabels");
        var user_labels = this.get("fitResult.labels");

        if (geq && residuals) {
            return genChartData(
                geq,
                residuals,
                user_labels.data.y.row_labels,
                "residuals",
                labels.data.x.axis_label,
                labels.fit.y.axis_label,
                labels.data.x.axis_units,
                labels.fit.y.axis_units,
                "line",
                true,
                2,
                plot_limit);
        } else {
            // Empty plot (clears any previous residuals)
            return genChartData([], []);
        }
    }.property("fitResult.geq", "fitResult.qof.residuals"),

    chartOptionsFit: function() {
        console.log("chartOptionsFit: called");
        var labels = this.get("fitLabels");
        console.log("chartOptionsFit: labels.data");
        console.log(labels.data);

        if (labels.data) {
            console.log("chartOptionsFit: updating ...");
            return genChartOptions(labels.data.x.axis_label,
                                   labels.data.y.axis_label,
                                   labels.data.x.axis_units,
                                   labels.data.y.axis_units);
        }
    }.property("fitLabels.data.x.axis_label",
               "fitLabels.data.y.axis_units",
               "fitLabels.data.x.axis_label",
               "fitLabels.data.y.axis_units"),

    chartDataMolefrac: function() {
        var plot_limit = this.get("PLOT_LIMIT");

        var geq = this.get("fitResult.geq");
        var molefrac = this.get("fitResult.fit.molefrac");

        // If model has been populated
        if (geq && molefrac) {
            return genChartData(
                geq,
                molefrac,
                ["H", "HG", "HG2"], // Add this to fit labels in backend!
                "molefraction",
                this.get("fitLabels.data.x.axis_label"),
                "Molefraction",
                this.get("fitLabels.data.x.axis_units"),
                "",
                "spline",
                false,
                2,
                plot_limit);
        }
    }.property("fitResult.geq", "fitResult.fit.molefrac"),

    chartOptionsMolefrac: function() {
        var labels = this.get("fitLabels");
        if (labels.data) {
            return genChartOptions(labels.data.x.axis_label,
                                   "Molefraction",
                                   labels.data.x.axis_units,
                                   "");
        }
    }.property("fitLabels.data.x.axis_label",
               "fitLabels.data.x.axis_label"),
});

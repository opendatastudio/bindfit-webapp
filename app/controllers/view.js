import Ember from 'ember';
import {defaultChartTheme, 
        genChartData, 
        genChartDataResiduals,
        genChartOptions} from '../helpers/bindfit-high-charts';

export default Ember.Controller.extend({
    // Limit number of fits to plot
    // TEMP TODO: move this to a constants file
    PLOT_LIMIT: 8,

    // Highcharts theme
    chartTheme: defaultChartTheme,

    // Highcharts data munging
    // See duplicated code in controllers/index
    // TODO this should be made into a mixin
    chartData: function() {
        return genChartData(
            this.get("model.fitResult.data"),
            this.get("model.fitResult.fit"),
            this.get("model.fitLabels"),
            this.get("PLOT_LIMIT"));
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

    fitterString: function() {
        var list = this.get("model.fitList");
        var fitter = this.get("model.fitOptions.fitter");

        // If no matching fitter is found, return raw fitter name
        // (This shouldn't happen!)
        var string = fitter;

        // Search for a matching fitter key in fitter list
        // and return its human-readable name
        list.forEach(function(item) {
            if (item.key === fitter) {
                string = item.name;
            }
        });

        return string;
    }.property("model.fitList", "model.fitOptions.fitter")
});

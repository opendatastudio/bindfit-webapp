import Ember from 'ember';
import {defaultChartTheme, 
        genChartData, 
        genChartDataResiduals,
        genChartOptions} from '../helpers/bindfit-high-charts';

export default Ember.Controller.extend({
    // Highcharts theme
    chartTheme: defaultChartTheme,

    // Highcharts data munging
    // See duplicated code in controllers/index
    // TODO this should be made into a mixin
    chartData: function() {
        return genChartData(
            this.get("fitResult.data"),
            this.get("fitResult.fit"),
            this.get("fitLabels"));
    }.property("fitResult.data", "fitResult.fit", "fitLabels.x"),

    chartDataResiduals: function() {
        return genChartDataResiduals(
            this.get("fitResult.data"),
            this.get("fitResult.fit"),
            this.get("fitLabels"));
    }.property("fitResult.data", "fitResult.fit", "fitLabels.x"),

    chartOptions: function() {
        return genChartOptions(this.get("fitLabels"));
    }.property("fitLabels.x"),

    fitterString: function() {
        var list = this.get("fitList");
        var fitter = this.get("fitOptions.fitter");

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
    }.property("fitList", "fitOptions.fitter")
});

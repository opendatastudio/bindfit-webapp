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
});

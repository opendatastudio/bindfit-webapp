import Ember from 'ember';
import {genChartData, genChartDataResiduals} from '../helpers/bindfit-high-charts';

export default Ember.Object.extend({
    data: null,
    fit:  null,

    reset: function() {
        this.set('data', null);
        this.set('fit', null);
    },

    isPopulated: Ember.computed('data', 'fit', function() {
        return (this.get('data') && this.get('fit'));
    }),

    // Computed properties for Highcharts data munging and chart series 
    // formatting
    chartData: function() {
        var series = genChartData(this.get("data"), this.get("fit"), {});

        console.log("FitOptions.chartData: chartData computed");
        console.log(series);

        return series;
    }.property("data", "fit"),

    chartDataResiduals: function() {
        var series = genChartDataResiduals(this.get("data"), this.get("fit"), {});

        console.log("FitOptions.chartDataResiduals: chartDataResiduals computed");
        console.log(series);

        return series;
    }.property("data", "fit"),
});

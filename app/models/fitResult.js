import Ember from 'ember';

export default Ember.Object.extend({
    data: null,
    fit: null,
    residuals: null, 
    params: null,

    chartData: Ember.computed("data", "fit", "residuals", function() {
        // Generate Highcharts series formatted fit data

        var series = [];

        var data      = this.get("data");
        var fit       = this.get("fit");

        // If model has been populated
        if (data) {
            var i;
            for (i = 0; i < fit.length; i++) {
                series.push({
                    name: "Fit "+String(i+1),
                    type: "spline",
                    marker: {enabled: false},
                    lineWidth: 2,
                    data: fit[i]
                });
            }

            for (i = 0; i < data.length; i++) {
                series.push({
                    name: "Data "+String(i+1),
                    type: "line",
                    marker: {enabled: true},
                    lineWidth: 0,
                    data: data[i]
                });
            }
        }

        console.log("FitOptions.chartData: chartData computed");
        console.log(series);

        return series;
    }),

    reset: function() {
        this.set('data', null);
        this.set('fit', null);
        this.set('residuals', null);
        this.set('params', null);
    }
});

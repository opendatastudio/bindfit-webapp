import Ember from 'ember';

export default Ember.Object.extend({
    data: null,
    fit: null,
    residuals: null, 
    params: null,

    chartData: Ember.computed("data", "fit", "residuals", function() {
        // Generate Highcharts series formatted fit data

        var series = [];
        var i = 0;

        var d = this.get("data");
        var f  = this.get("fit");
            
        // If model has been populated
        if (d) {
            // Assume all data matches data.geq length
            // TODO if not throw error
            var data = [];
            var fit  = [];
            var data_series = [];
            var fit_series  = [];

            // For each observation
            for (var obs = 0; obs < d.y.length; obs++) {
                data_series = [];
                fit_series = [];

                // Create [[geq, y], [geq, y]...] array for each obs 
                // For each point in current observation
                for (i = 0; i < d.geq.length; i++) {
                    data_series.push([d.geq[i], d.y[obs][i]]);
                    fit_series.push([d.geq[i], f.y[obs][i]]);
                }

                data.push(data_series);
                fit.push(fit_series);
            }



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
    },

    isPopulated: Ember.computed('data', 'fit', 'residuals', 'params', function() {
        return (this.get('data') && this.get('fit') && this.get('residuals') && this.get('params'));
    })
});

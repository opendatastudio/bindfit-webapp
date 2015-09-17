import Ember from 'ember';

export default Ember.Object.extend({
    data: null,
    fit:  null,

    chartData: Ember.computed("data", "fit", function() {
        // Generate Highcharts series formatted fit data

        // Limit number of datas to plot
        var PLOT_LIMIT = 8;

        var series = [];
        var i = 0;

        var d = this.get("data");
        var f  = this.get("fit");
            
        // If model has been populated
        if (d) {
            var data_series = [];
            var fit_series  = [];

            var data_y = d.y[0];
            var fit_y  = f.y[0];
            
            // Assume all data and fits matche data.x[0] length
            // TODO if not throw error
            var y_len  = data_y.length;
            if (y_len > PLOT_LIMIT) {
                y_len = PLOT_LIMIT;
            }

            // Calculate geq for x axis
            var data_x = [];
            var h0 = d.x[0];
            var g0 = d.x[1];
            for (i = 0; i < g0.length; i++) {
                data_x.push(g0[i]/h0[i]);
            }

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
    }),

    reset: function() {
        this.set('data', null);
        this.set('fit', null);
        this.set('abs', false);
    },

    isPopulated: Ember.computed('data', 'fit', function() {
        return (this.get('data') && this.get('fit'));
    })
});

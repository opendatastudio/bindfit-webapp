import Ember from 'ember';

export default Ember.Object.extend({
    data: null,
    fit:  null,

    reset: function() {
        this.set('data', null);
        this.set('fit', null);
        this.set('abs', false);
    },

    isPopulated: Ember.computed('data', 'fit', function() {
        return (this.get('data') && this.get('fit'));
    }),

    // Computed properties for Highcharts data munging and chart series 
    // formatting
    chartData: function() {
        // Generate Highcharts series formatted fit data

        var series = [];
        var i = 0;

        var d = this.get("data");
        var f  = this.get("fit");
            
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
    }.property("data", "fit"),

    chartDataResiduals: function() {
        // Generate Highcharts series formatted fit residual data

        var series = [];
        var i = 0;

        var d = this.get("data");
        var f  = this.get("fit");
            
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
    }.property("data", "fit"),


});

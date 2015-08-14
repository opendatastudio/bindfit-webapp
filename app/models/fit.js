import Ember from 'ember';

export default Ember.Object.extend({
    data: {
        data: null,
        fit: null,
        residuals: null, 
        params: null
    },

    options: {
        x: {label: null, units: null},
        y: {label: null, units: null},
        params: null 
    },

    chartData: Ember.computed("data", "options", function() {
        var series = [];

        var data = this.get("data");
        //var options = this.get("options");

        // If model has been populated
        if (data.data) {
            var i;
            for (i = 0; i < data.fit.length; i++) {
                series.push({
                    name: "Fit "+String(i+1),
                    type: "spline",
                    marker: {enabled: false},
                    lineWidth: 2,
                    data: data.fit[i]
                });
            }

            for (i = 0; i < data.data.length; i++) {
                series.push({
                    name: "Data "+String(i+1),
                    type: "line",
                    marker: {enabled: true},
                    lineWidth: 0,
                    data: data.data[i]
                });
            }
        }

        console.log("Fit.chartData: chartData computed");
        console.log(series);

        return series;
    })
});

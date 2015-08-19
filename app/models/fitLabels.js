import Ember from 'ember';

export default Ember.Object.extend({
    x: {
        label: null,
        units: null,
    },

    y: {
        label: null,
        units: null,
    },

    params: null,

    chartOptions: Ember.computed("x", "y", "params", function() {
        // Generate Highcharts options formatted fit labels

        var x      = this.get("x");
        var y      = this.get("y");
        var params = this.get("params");

        var chartOptions = {
            title: {
                text: "",
            },
            subtitle: {
                text: "",
            },
            xAxis: {
                title: {
                    text: "Equivalent total [G]\u2080/[H]\u2080",
                    text: x.label
                },
                labels: {
                    format: "{value}",
                    format: "{value} "+x.units
                }
            },
            yAxis: { // Primary y axis
                title: {
                    text: "\u03B4",
                    text: y.label
                },
                labels: {
                    format: "{value} ppm",
                    format: "{value} "+y.units
                }
            }
        };

        console.log("FitLabels.chartOptions: chartOptions computed");
        console.log(chartOptions);

        return chartOptions;
    })
});

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

        var chartOptions = {
            title: {
                text: "",
            },
            subtitle: {
                text: "",
            },
            xAxis: {
                title: {
                    text: x.label
                },
                labels: {
                    format: "{value} "+x.units
                }
            },
            yAxis: { // Primary y axis
                title: {
                    text: y.label
                },
                labels: {
                    format: "{value} "+y.units
                }
            }
        };

        return chartOptions;
    })
});

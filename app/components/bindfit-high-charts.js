import Ember from 'ember';
import EmberHighChartsComponent from 'ember-highcharts/components/high-charts';

const {
  get,
  observer,
  on
} = Ember;

export default EmberHighChartsComponent.extend({
    // Identify Highcharts container divs for Highcarts/Bootstrap tabs 
    // reflow fix
    // See this.setupHighcharts()
    classNames: ["contains-chart"],

    contentDidChange: observer('content.@each.isLoaded', function() {
        var content = this.get("content");
        Ember.run.debounce(this, this.debouncedContentDidChange, 20);
    }),

    debouncedContentDidChange: function() {
        var content = this.get("content");
        var chart = this.get("chart");

        // TODO i'm not sure anyone could tell me why this is the case???
        // seems like trying to address an edge case???
        if (!(content && chart)) {
            this.debug("either no content or no chart");
            return;
        }

        let noData = chart.get('noData');

        if (noData != null) {
            noData.remove();
        }
        
        // Hack to fix old series sticking around
        // Remove all series from chart before redrawing
        while( chart.series.length > 0 ) {
            chart.series[0].remove( false );
        }
        
        // holy shitballs this is expensive!!! 
        chart.redraw();
        // End hack

        return get(this, 'content').forEach((series, idx) => {
            if (chart.series[idx]) {
                return chart.series[idx].setData(series.data);
            } else {
                return chart.addSeries(series);
            }
        });
    },

    chartAxesDidChange: observer('chartOptions.xAxis', 'chartOptions.yAxis', function() {
        Ember.run.debounce(this, this.debouncedChartAxisDidChange, 20);
    }),

    debouncedChartAxisDidChange: function() {
        /***
         * Handles updating xAxis/yAxis options programmatically if
         * chartOptions is changed.
         *
         * TODO: move dynamic chartOptions to a different variable?
         */

        // If no content or chart, return
        if (!(get(this, 'chart'))) {
            return;
        }

        var x = get(this, 'chart.xAxis')[0];
        var y = get(this, 'chart.yAxis')[0];
        var xNew = get(this, 'chartOptions.xAxis');
        var yNew = get(this, 'chartOptions.yAxis');

        x.update(xNew);
        y.update(yNew);
        return;
    },

    // Hacky jQuery setup function for synchronised charts, called afterRender
    // Overrides default Highcharts mousmove/touchmove methods
    // TODO move charts container ID here to external constants module

    setupHighcharts: on("didInsertElement", function() {
        // In order to synchronize tooltips and crosshairs, override the 
        // built-in events with handlers defined on the parent element.
        Ember.$("#chart-fit").bind("mousemove touchmove", function (e) {
            var chart,
                point,
                i;

            for (i = 0; i < Highcharts.charts.length; i = i + 1) {
                chart = Highcharts.charts[i];
                e = chart.pointer.normalize(e); // Find coordinates within the chart
                point = chart.series[0].searchPoint(e); // Get the hovered point

                if (point) {
                    point.onMouseOver(); // Show the hover marker
                    // chart.tooltip.refresh(point); // Show the tooltip
                    // Tooltip refresh doesn't work with shared tooltip - need
                    // to send array of points - TODO how to obtain this?
                    chart.xAxis[0].drawCrosshair(e, point); // Show the crosshair
                }
            }
        });

        // Highcharts reflow/resize within Bootstrap tab fix
        // http://stackoverflow.com/questions/14954624/
        // highcharts-does-not-resize-charts-inside-tabs 
        Ember.$(document).on('shown.bs.tab', 'a[data-toggle="tab"]', function (e) {
            Ember.$(".contains-chart" ).each(function() { // Target elements w/ "contains-chart" class applied
                var chart = Ember.$(this).highcharts(); // Target chart itself
                chart.reflow(); // Reflow chart
            });
        });
    }),
});

// vim: set ts=4:

import Ember from 'ember';
import EmberHighChartsComponent from 'ember-highcharts/components/high-charts';

const {
  get,
  observer
} = Ember;

export default EmberHighChartsComponent.extend({
    contentDidChange: observer('content.@each.isLoaded', function() {
        // If no content or chart, return
        if (!(get(this, 'content') && get(this, 'chart'))) {
            return;
        }

        let chart  = get(this, 'chart');
        let noData = chart.get('noData');

        if (noData != null) {
            noData.remove();
        }
        
        // Hack to fix old series sticking around
        // Remove all series from chart
        while( chart.series.length > 0 ) {
            chart.series[0].remove( false );
        }
        chart.redraw();
        // End hack

        return get(this, 'content').forEach((series, idx) => {
            if (chart.series[idx]) {
                return chart.series[idx].setData(series.data);
            } else {
                return chart.addSeries(series);
            }
        });
    }),

    chartAxesDidChange: observer('chartOptions.xAxis', 'chartOptions.yAxis', function() {
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
    })
});

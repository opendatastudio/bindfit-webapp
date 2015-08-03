import Ember from 'ember';
import EmberHighChartsComponent from 'ember-highcharts/components/high-charts';

const {
  get,
  observer
} = Ember;

export default EmberHighChartsComponent.extend({

    contentDidChange: observer('content.@each.isLoaded', function() {
        if (!(get(this, 'content') && get(this, 'chart'))) {
          return;
        }

        let chart  = get(this, 'chart');
        let noData = chart.get('noData');

        if (noData != null) {
          noData.remove();
        }
        
        // TEMP hack to fix old series sticking around
        while( chart.series.length > 0 ) {
          chart.series[0].remove( false );
        }
        chart.redraw();
        // end hack

        return get(this, 'content').forEach((series, idx) => {
          if (chart.series[idx]) {
            return chart.series[idx].setData(series.data);
          } else {
            return chart.addSeries(series);
          }
        });
      })

});

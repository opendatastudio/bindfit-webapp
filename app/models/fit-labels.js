import Ember from 'ember';
import {genChartOptions} from '../helpers/bindfit-high-charts';

export default Ember.Object.extend({
    x: {
        label: null,
        units: null,
    },

    y: {
        label: null,
        units: null,
    },

    params: null
});

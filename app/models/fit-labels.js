import Ember from 'ember';

export default Ember.Object.extend({
    data: {
        x: {
            axis_label: null,
            axis_units: null
        },
        y: {
            axis_label: null,
            axis_units: null
        }
    },

    fit: {
        params: null,
        y: {
            axis_label: null,
            axis_units: null
        }
    }
});

import Ember from 'ember';

export default Ember.Object.extend({
    fitter: null,
    params: null,
    data_id: "",

    reset: function() {
        this.setProperties({
            fitter: null,
            params: null,
            data_id: ""
        });
    },

    isPopulated: Ember.computed('fitter', 'data_id', 'params', function() {
        return (this.get('fitter') && this.get('params'));
    })
});

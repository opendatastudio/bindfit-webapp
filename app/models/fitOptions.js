import Ember from 'ember';

export default Ember.Object.extend({
    fitter: null,

    input: {
        type: null,
        value: null,
    },

    params: null,



    reset: function() {
        this.setProperties({
            fitter: null,
            input: {
                type: null,
                value: null,
            },
            params: null
        });
    },

    isPopulated: Ember.computed('fitter', 'input', 'params', function() {
        return (this.get('fitter') && this.get('input') && this.get('params'));
    })
});

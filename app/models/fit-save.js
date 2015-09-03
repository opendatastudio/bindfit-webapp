import Ember from 'ember';

export default Ember.Object.extend({
    id: null,

    url: Ember.computed('id', function() {
        return "http://app.supramolecular.echus.co/bindfit/view/"+this.get('id');
    }),

    reset: function() {
        this.set('id', null);
    },

    isPopulated: Ember.computed('id', function() {
        return this.get('id');
    })
});

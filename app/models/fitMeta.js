import Ember from 'ember';

export default Ember.Object.extend({
    name: null,
    notes: null,

    reset: function() {
        this.set('name', null);
        this.set('notes', null);
    }
});

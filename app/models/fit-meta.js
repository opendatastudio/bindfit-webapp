import Ember from 'ember';

export default Ember.Object.extend({
    author: null,
    name: null,
    date: null,
    timestamp: null,
    ref: null,
    host: null,
    guest: null,
    solvent: null,
    temp: null,
    notes: null,

    reset: function() {
        this.set('author', null);
        this.set('name', null);
        this.set('date', null);
        this.set('timestamp', null);
        this.set('ref', null);
        this.set('host', null);
        this.set('guest', null);
        this.set('solvent', null);
        this.set('temp', null);
        this.set('notes', null);
    }
});

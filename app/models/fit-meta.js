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
    temp_unit: "C", // Default temperature unit is Celsius
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
        this.set('temp', "C");
        this.set('temp_unit', null);
        this.set('notes', null);
    }
});

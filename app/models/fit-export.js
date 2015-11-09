import Ember from 'ember';

export default Ember.Object.extend({
    export_url: null,

    reset: function() {
        this.set('export_url', null);
    },

    isPopulated: Ember.computed('url', function() {
        return this.get('export_url');
    })
});

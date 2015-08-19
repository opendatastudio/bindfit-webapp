import Ember from 'ember';

export default Ember.Object.extend({
    url: null,

    reset: function() {
        this.set('url', null);
    }
});

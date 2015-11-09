import Ember from 'ember';

export default Ember.Object.extend({
    fit_id: null,

    url: function() {
        return "http://app.supramolecular.echus.co/bindfit/view/"+this.get("fit_id");
    }.property("fit_id"),

    reset: function() {
        this.set("fit_id", null);
    },

    isPopulated: function() {
        return this.get("fit_id");
    }.property("fit_id")
});

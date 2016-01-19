import Ember from 'ember';
import ENV from 'bindfit-client/config/environment';

export default Ember.Object.extend({
    fit_id: null,

    url: function() {
        return ENV.siteURL+"view/"+this.get("fit_id");
    }.property("fit_id"),

    reset: function() {
        this.set("fit_id", null);
    },

    isPopulated: function() {
        return this.get("fit_id");
    }.property("fit_id")
});

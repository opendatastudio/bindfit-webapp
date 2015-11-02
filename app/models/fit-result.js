import Ember from 'ember';

export default Ember.Object.extend({
    data: {
        x: null,
        y: null
    },

    fit:  null,

    geq: function() {
        var x = this.get("data.x");

        // If data x values are populated
        if (x) {
            // Calculate G/H equivalent concentration
            var geq  = [];
            var h0 = x[0];
            var g0 = x[1];
            for (let i = 0; i < g0.length; i++) {
                geq.push(g0[i]/h0[i]);
            }

            return geq;
        } else {
            return null;
        }
    }.property("data.x"),

    isPopulated: function() {
        return (this.get("data") && this.get("fit"));
    }.property("data", "fit"),

    reset: function() {
        this.set("data", null);
        this.set("fit", null);
    }
});

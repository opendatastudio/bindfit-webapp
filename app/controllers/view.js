import Ember from 'ember';

export default Ember.Controller.extend({
    fitterString: function() {
        var list = this.get("model.fitList");
        var fitter = this.get("model.fitOptions.fitter");

        // If no matching fitter is found, return raw fitter name
        // (This shouldn't happen!)
        var string = fitter;

        // Search for a matching fitter key in fitter list
        // and return its human-readable name
        list.forEach(function(item) {
            if (item.key === fitter) {
                string = item.name;
            }
        });

        return string;
    }.property("model.fitList", "model.fitOptions.fitter")
});

import Ember from 'ember';

export default Ember.Component.extend({
    paramsLabelled: function() {
        console.log("COMPONENT fit-result-table: called");
        var labels = this.get("fitLabels.fit.params");
        return this.get("fitResult").paramsLabelled(labels);
    }.property("fitResult.params", "fitLabels.fit.params"),
});

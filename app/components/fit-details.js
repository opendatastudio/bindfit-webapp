import Ember from 'ember';

export default Ember.Component.extend({

  paramsLabelled: function() {
    var labels = this.get("fitLabels.fit.params");

    var results = 
      this.get("fitResult").paramsLabelled(labels);

    return results;
  }.property("fitResult.params", "fitLabels.fit.params"),

});

import Ember from 'ember';


const ROWS_PER_PAGE = 10;


export default Ember.Component.extend({
   
  currentPage: 1,
  countPages: 10,


  paramsLabelled: function() {
    console.log("COMPONENT fit-result-table: called");
    var labels = this.get("fitLabels.fit.params");

    var results = 
      this.get("fitResult").paramsLabelled(labels);

    console.log(results.length);

    return results;
  }.property("fitResult.params", "fitLabels.fit.params"),

  actions: {
    pageChanged(current, previous) {
      console.log(current, previous);
    }
  }
});

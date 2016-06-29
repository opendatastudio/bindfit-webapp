import Ember from 'ember';

export default Ember.Component.extend({
/*  fits: null,*/
  //choices: null,
  /*selectedFits: null,*/
  actions: {
    resetSelection: function() {
      var selection = this.get("selectedFits");
      selection = [];
      this.set("selectedFits", selection);
    }
  }
  
});

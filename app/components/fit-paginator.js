import Ember from 'ember';

export default Ember.Component.extend({
  
  pagesList: function() {
    var pages = [];
    var countPages = this.get("countPages"); 

    // give me es6 or give me death
    for (var i = 1; i <= countPages; i++) {
      pages.push(i);
    }

    return pages; 
  }.property("n"),


});

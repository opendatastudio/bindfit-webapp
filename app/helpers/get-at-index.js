import Ember from 'ember';

export default Ember.Handlebars.helper('get-at-index', function(array, index, property) {
    /***
     * Simple helper to return the value of a property of an object at the 
     * specified index in given array.
     */

    return array[index][property]; 
});

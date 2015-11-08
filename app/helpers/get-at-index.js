import Ember from 'ember';

export function getAtIndex(params) {
    /***
     * Simple helper to return the value of a property of an object at the 
     * specified index in given array.
     */

    var array = params[0];
    var index = params[1];
    var property = params[2];
    return array[index][property]; 
}

export default Ember.Helper.helper(getAtIndex);

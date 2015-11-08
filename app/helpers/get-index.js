import Ember from 'ember';

export function getIndex(params) {
    /***
     * Simple helper to return the value at a specified index in an array.
     */

    var array = params[0];
    var index = params[1];
    return array[index]; 
}

export default Ember.Helper.helper(getIndex);

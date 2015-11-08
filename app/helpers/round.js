import Ember from 'ember';

export function round(params) {
    /***
     * Simple helper to round float to specified number of decimal places
     */
    var number = params[0];
    var dp = params[1];
    return number.toFixed(dp);
}

export default Ember.Helper.helper(round);

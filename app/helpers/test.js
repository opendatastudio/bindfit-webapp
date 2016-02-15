import Ember from 'ember';

export function formatSci(params) {
    /***
     * Float formatting to specified number of dps. Uses scientific
     * notation where appropriate.
     */

    var number = params[0];
    var dp = params[1];
    if (number < 0.05) {
        return number.toExponential(dp);
    } else {
        return number.toFixed(dp);
    }
}

export default Ember.Helper.helper(formatSci);

import Ember from 'ember';

export function isArray(params/*, hash*/) {
    /***
     * Checked if passed argument is array
     */
    if (params[0]) {
        return params[0].constructor === Array;
    } else {
        return false;
    }
}

export default Ember.Helper.helper(isArray);

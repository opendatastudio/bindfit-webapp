import Ember from 'ember';

export function isArray(params/*, hash*/) {
    /***
     * Checked if passed argument is array
     */
    return params[0].constructor === Array;
}

export default Ember.Helper.helper(isArray);

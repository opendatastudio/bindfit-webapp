import Ember from 'ember';

export default Ember.Handlebars.helper('round', function(number, dp) {
    /***
     * Simple helper to return value of input float rounded to specified DP.
     */

    return number.toFixed(dp);
});

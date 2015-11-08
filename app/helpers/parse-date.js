import Ember from 'ember';

export function parseDate(params) {
    /***
     * Return formatted date from timestamp
     */
    var timestamp = params[0];

    // Check if timestamp is a valid date string
    // Return empty string if not
    if (isNaN(Date.parse(timestamp)) === false) {
        return new Date(timestamp).toDateString();
    } else {
        return "";
    }
}

export default Ember.Helper.helper(parseDate);

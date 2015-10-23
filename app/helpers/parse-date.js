import Ember from 'ember';

export default Ember.Handlebars.helper("parse-date", function(timestamp) {
    /***
     * Return formatted date from timestamp
     */

    // Check if timestamp is a valid date string
    // Return empty string if not
    if (isNaN(Date.parse(timestamp)) === false) {
        return new Date(timestamp).toDateString();
    } else {
        return "";
    }
});

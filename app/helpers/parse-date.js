import Ember from 'ember';

export default Ember.Handlebars.helper("parse-date", function(timestamp) {
    /***
     * Return formatted date from timestamp
     */
    return new Date(timestamp).toDateString();
});

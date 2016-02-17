import Ember from 'ember';
import ENV from 'bindfit-client/config/environment';

export default Ember.Object.extend({
    matches: null,

    links: function() {
        var matches = this.get("matches");

        var links = []
        if (matches) {
            matches.forEach(function(match) {
                links.push({
                    id:     match.id,
                    link:   ENV.viewURL+match.id,
                    name:   match.name,
                    author: match.author
                });
            });
        }

        return links;
    }.property("matches"),

    numMatches: function() {
        var matches = this.get("matches");

        if (matches !== null) {
            return matches.length;
        } else {
            return null;
        }
    }.property("matches"),

    isPopulated: function() {
        var matches = this.get("matches");
        return (matches !== null)
    }.property("matches")
});

import Ember from 'ember';
import ENV from 'bindfit-client/config/environment';

export default Ember.Object.extend({
    matches: null,

    links: function() {
        var matches = this.get("matches");

        var links = [];
        if (matches) {
            matches.forEach(function(match) {
                links.push({
                    link:        ENV.viewURL+match.id,
                    id:          match.id,
                    fitter_name: match.fitter_name,
                    name:        match.name,
                    author:      match.author,
                    timestamp:   match.timestamp,
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
        return (matches !== null);
    }.property("matches")
});

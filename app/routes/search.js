import Ember from 'ember';
import ENV from 'bindfit-client/config/environment';

import SearchResult  from "../models/search-result";

import FitLabels     from "../models/fit-labels";
import SearchOptions from "../models/search-options";

export default Ember.Route.extend({
    model: function() {
        var model = Ember.RSVP.hash({
            searchResult:  SearchResult.create({}),

            // For advanced search options
            fitList:       Ember.$.getJSON(ENV.API.list),

            fitLabels:     FitLabels.create({}),
            searchOptions: SearchOptions.create({})
        });

        return model;
    }
});

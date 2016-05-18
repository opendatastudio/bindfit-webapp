import Ember from 'ember';
import ENV from 'bindfit-client/config/environment';

import SearchResult  from "../models/search-result";

import FitLabels  from "../models/fit-labels";
import FitOptions from "../models/fit-options";

export default Ember.Route.extend({
    model: function() {
        var model = Ember.RSVP.hash({
            searchResult: SearchResult.create({}),

            // For advanced search options
            fitList:      Ember.$.getJSON(ENV.API.list),

            fitLabels:    FitLabels.create({}),
            fitOptions:   FitOptions.create({})
        });

        return model;
    }
});

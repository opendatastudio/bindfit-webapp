import Ember from 'ember';

import SearchResult  from "../models/search-result";

export default Ember.Route.extend({
    model: function() {
        var model = {
            searchResult: SearchResult.create({})
        }
        return model;
    }
});

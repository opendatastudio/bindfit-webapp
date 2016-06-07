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
    },

    setupController: function(controller, model) {
        // Group fitList by group into format desired by power-select
        var grouped = {};
        model.fitList.forEach(function(item) {
            if (grouped[item.group]) {
                grouped[item.group].options.push(item)
            } else {
                grouped[item.group] = {
                    "groupName": item.group,
                    "options":   [item]
                }
            }
        });

        var fitListGrouped = [];
        Object.keys(grouped).forEach(function(key) {
            fitListGrouped.push(grouped[key]);
        });

        model.fitList = fitListGrouped;

        controller.set('model', model);
    }
});

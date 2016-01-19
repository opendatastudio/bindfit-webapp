import Ember from 'ember';
import ENV from 'bindfit-client/config/environment';

import FitResult  from "../models/fit-result";
import FitLabels  from "../models/fit-labels";
import FitExport  from "../models/fit-export";
import FitSave    from "../models/fit-save";

export default Ember.Route.extend({
    model: function(params) {
        // Retrieve specified fit data from backend
        return Ember.$.getJSON(ENV.API.view+params.id).then(function(response) {
            // Populate full model for retrieved fit
            // (labels must be retrieved separately)
            var model = {
                fitID:      params.id,

                fitList:    Ember.$.getJSON(ENV.API.list),

                fitLabels:  Ember.$.ajax({
                    url:  ENV.API.labels,
                    type: "POST",
                    data: JSON.stringify({fitter: response.fitter}),
                    contentType: "application/json; charset=utf-8",
                    dataType:    "json"
                    })
                    .then(function(data) {
                        return FitLabels.create(data);
                    }),

                fitResult:  FitResult.create(response),
                
                fitExport:  FitExport.create({}),
                fitSave:    FitSave.create({})
            };

            return Ember.RSVP.hash(model);
        });
    }
});

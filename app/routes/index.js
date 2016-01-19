import Ember from 'ember';
import ENV from 'bindfit-client/config/environment';

import FitResult  from "../models/fit-result";
import FitLabels  from "../models/fit-labels";
import FitOptions from "../models/fit-options";
import FitExport  from "../models/fit-export";
import FitSave    from "../models/fit-save";

export default Ember.Route.extend({
    model: function() {
        var model = Ember.RSVP.hash({
            // Fitter models
            fitList:    Ember.$.getJSON(ENV.API.list),

            fitLabels:  FitLabels.create({}),
            fitOptions: FitOptions.create({}),
            fitResult:  FitResult.create({}),

            fitExport:  FitExport.create({}),
            fitSave:    FitSave.create({})
        });

        return model;
    }
});

import Ember from 'ember';
import FitResult  from "../models/fit-result";
import FitLabels  from "../models/fit-labels";
import FitOptions from "../models/fit-options";
import FitExport  from "../models/fit-export";
import FitMeta    from "../models/fit-meta";
import FitSave    from "../models/fit-save";

export default Ember.Route.extend({
    urls: {
        list:   "http://api.supramolecular.echus.co/bindfit/list",
    },

    model: function() {
        var urls = this.urls;

        var model = Ember.RSVP.hash({
            // Fitter models
            fitList:    Ember.$.getJSON(urls.list),

            fitLabels:  FitLabels.create({}),
            fitOptions: FitOptions.create({}),
            fitResult:  FitResult.create({}),

            fitExport:  FitExport.create({}),
            fitMeta:    FitMeta.create({}),
            fitSave:    FitSave.create({})
        });

        return model;
    },

    setupController: function(controller, model) {
        controller.setProperties(model);
    }
});

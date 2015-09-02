import Ember from 'ember';
import FitResult  from "../models/fitResult";
import FitLabels  from "../models/fitLabels";
import FitOptions from "../models/fitOptions";
import FitExport  from "../models/fitExport";
import FitMeta    from "../models/fitMeta";
import FitSave    from "../models/fitSave";

export default Ember.Route.extend({
    urls: {
        list:   "http://supramolecular.echus.co/bindfit/api/list",
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

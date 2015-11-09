import Ember from 'ember';
import FitResult  from "../models/fit-result";
import FitOptions from "../models/fit-options";
import FitExport  from "../models/fit-export";
import FitSave    from "../models/fit-save";
import FitMeta    from "../models/fit-meta";

export default Ember.Route.extend({
    urls: {
        view:   "http://api.supramolecular.echus.co/bindfit/fit/",
        list:   "http://api.supramolecular.echus.co/bindfit/list",
    },

    model: function(params) {
        var urls = this.urls;

        // Retrieve specified fit data from backend
        return Ember.$.getJSON(urls.view+params.id).then(function(response) {
            // Populate full model for retrieved fit
            // (labels must be retrieved separately)
            var model = {
                fitList:    Ember.$.getJSON(urls.list),

                fitOptions: FitOptions.create(response.options),
                fitResult:  FitResult.create(response.fit),
                fitMeta:    FitMeta.create(response.meta),
                fitID:      params.id,
                
                fitExport:  FitExport.create({}),
                fitSave:    FitSave.create({})
            };

            return Ember.RSVP.hash(model);
        });
    }
});

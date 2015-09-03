import Ember from 'ember';
import FitResult  from "../models/fit-result";
import FitLabels  from "../models/fit-labels";
import FitOptions from "../models/fit-options";
import FitMeta    from "../models/fit-meta";

export default Ember.Route.extend({
    urls: {
        view:   "http://api.supramolecular.echus.co/bindfit/fit/",
        list:   "http://api.supramolecular.echus.co/bindfit/list",
        labels: "http://api.supramolecular.echus.co/bindfit/labels",
    },

    model: function(params) {
        var urls = this.urls;

        // Retrieve specified fit data from backend
        return Ember.$.getJSON(urls.view+params.id).then(function(fit) {
            // Populate full model for retrieved fit
            // (labels must be retrieved separately)
            var model = {
                fitOptions: FitOptions.create(fit.options),
                fitResult:  FitResult.create(fit.result),
                fitLabels:  Ember.$.ajax({
                    url:  urls.labels,
                    type: "POST",
                    data: JSON.stringify({fitter: fit.options.fitter}),
                    contentType: "application/json; charset=utf-8",
                    dataType:    "json"
                    })
                    .then(function(data) {
                        return FitLabels.create(data);
                    }),
                // TODO set human readable name here after retrieving
                // urls.list
                fitMeta:    FitMeta.create(fit.metadata)
            };

            return Ember.RSVP.hash(model);
        });
    },

    setupController: function(controller, model) {
        controller.setProperties(model);
    }
});

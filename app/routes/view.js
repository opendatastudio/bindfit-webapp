import Ember from 'ember';
import FitResult  from "../models/fitResult";
import FitLabels  from "../models/fitLabels";
import FitOptions from "../models/fitOptions";

export default Ember.Route.extend({
    urls: {
        view:   "http://supramolecular.echus.co/bindfit/api/fit/",
        list:   "http://supramolecular.echus.co/bindfit/api/list",
        labels: "http://supramolecular.echus.co/bindfit/api/labels",
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
                fitName:    fit.name
            };

            return Ember.RSVP.hash(model);
        });
    },

    setupController: function(controller, model) {
        controller.setProperties(model);
    }
});

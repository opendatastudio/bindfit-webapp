import Ember from 'ember';
import FitResult  from "../models/fit-result";
import FitLabels  from "../models/fit-labels";
import FitOptions from "../models/fit-options";
import FitExport  from "../models/fit-export";
import FitSave    from "../models/fit-save";

export default Ember.Route.extend({
    controllerName: "index",

    renderTemplate: function () {
        var controller = this.controllerFor("index");
        this.render("index", {controller: controller});
    },

    urls: {
        view:   "http://api.supramolecular.echus.co/bindfit/fit/",
        list:   "http://api.supramolecular.echus.co/bindfit/list",
        labels: "http://api.supramolecular.echus.co/bindfit/labels",
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

                fitLabels:  Ember.$.ajax({
                    url:  urls.labels,
                    type: "POST",
                    data: JSON.stringify({fitter: response.fitter}),
                    contentType: "application/json; charset=utf-8",
                    dataType:    "json"
                    })
                    .then(function(data) {
                        return FitLabels.create(data);
                    }),

                fitID:      params.id,
                
                fitExport:  FitExport.create({}),
                fitSave:    FitSave.create({})
            };

            return Ember.RSVP.hash(model);
        });
    }
});

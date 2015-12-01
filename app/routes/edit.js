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

            // Parse fit result parameters into fitOptions hash for further
            // fitting

            // Create intial parameter hash
            var params = response.fit.params;
            var paramsInit = {};
            
            var keys = Object.keys(params);
            keys.forEach(function(key) {
                if (params.hasOwnProperty(key)) {
                    paramsInit[key] = params[key].init;
                }
            });

            // Build fitOptions object
            var fitOptions = {
                fitter:  response.fitter,
                data_id: response.data_id,
                params:  paramsInit,
                options: response.options
            };

            var model = {
                fitList:    Ember.$.getJSON(urls.list),

                // Parse fit settings into fitOptions object for re-fitting
                // if required
                fitOptions: FitOptions.create(fitOptions),
                fitResult:  FitResult.create(response),

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
    },
    
    setupController: function(controller, model) {
        console.log("setupController: model.fitResult, Options");
        console.log(model.fitResult);
        console.log(model.fitOptions);
        controller.set('model', model);
    }
});

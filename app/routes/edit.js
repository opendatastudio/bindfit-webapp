import Ember from 'ember';
import ENV from 'bindfit-client/config/environment';

import FitResult  from "../models/fit-result";
import FitLabels  from "../models/fit-labels";
import FitOptions from "../models/fit-options";
import FitExport  from "../models/fit-export";
import FitSave    from "../models/fit-save";

import getFitterSelection from '../helpers/get-fitter-selection';

export default Ember.Route.extend({
    controllerName: "index",

    renderTemplate: function () {
        var controller = this.controllerFor("index");
        this.render("index", {controller: controller});
    },

    model: function(urlParams) {
        // Retrieve specified fit data from backend
        return Ember.$.getJSON(ENV.API.view+urlParams.id).then(function(response) {
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
                fitID:      urlParams.id,
                fitEditKey: urlParams.key,

                fitList:    Ember.$.getJSON(ENV.API.list),

                // Parse fit settings into fitOptions object for re-fitting
                // if required
                fitOptions: FitOptions.create(fitOptions),
                fitResult:  FitResult.create(response),

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

        var selection = getFitterSelection(model.fitOptions.fitter, 
                                           model.fitList);

        // Populate model
        // TODO: instead of doing this, do null checks in onFitterSelect resets?
        controller.set('model', model);
        // Select appropriate fitter
        controller.send('onFitterSelect', selection);
        // Reopulate model (to avoid onFitterSelect resets)
        controller.set('model', model);
    }
});

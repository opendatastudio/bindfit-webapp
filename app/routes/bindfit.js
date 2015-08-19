import Ember from 'ember';
import FitResult  from "../models/fitResult";
import FitLabels  from "../models/fitLabels";
import FitOptions from "../models/fitOptions";
import FitExport  from "../models/fitExport";

export default Ember.Route.extend({
    urls: {
        list:    "http://supramolecular.echus.co/bindfit/api/list",
    },

    model: function() {
        var urls = this.urls;

        var model = Ember.RSVP.hash({
            fitList:    Ember.$.getJSON(urls.list),
            fitLabels:  FitLabels.create({}),
            fitOptions: FitOptions.create({}),
            fitResult:  FitResult.create({}),
            fitExport:  FitExport.create({})
        });

        return model;
    },
       
    setupController: function(controller, model) {
        controller.setProperties(model);
    }
});

import Ember from 'ember';
import ENV from 'bindfit-client/config/environment';

export default Ember.Component.extend({
    actions: {
        calcMonteCarlo: function(callback) {
            var _this = this;

            var request = _this.get("fit");

            console.log("actions.saveFit: request to send");
            console.log(request);
            console.log("actions.saveFit: request no_fit flag");
            console.log(request.no_fit);

            // Workaround for no_fit == false not getting sent along with
            // other values in the JSON
            // TODO: why is this happening?
            if (request.no_fit === false) {
                request.no_fit = 0;
            }

            // Send fitResult to backend for calculation 
            var promise = new Ember.RSVP.Promise(function(resolve, reject) {
                Ember.$.ajax({
                    url:  ENV.API.mc,
                    type: "POST",
                    data: JSON.stringify(request),
                    contentType: "application/json; charset=utf-8",
                    dataType:    "json"
                })
                .done(resolve)
                .fail(reject);
            });

            // For async button
            callback(promise);

            promise.then(
            function(data) {
                console.log("actions.calcMonteCarlo: $.ajax: calc success");
                console.log(data);

                var fitResult = _this.get('fit');

                // Set saved Fit ID
                fitResult.set('fit.params', data);
                // Manually trigger property change notification to observers
                // Workaround: Ember appears to not notify automatically here
                fitResult.notifyPropertyChange('params');

                console.log("actions.calcMonteCarlo: $.ajax: fit.params set");
                console.log(fitResult.get('fit.params'));
            },
            function(error) {
                console.log("actions.calcMonteCarlo: $.ajax: calc fail");
                console.log(error);
            });
        }, // calcMonteCarlo
    } // actions
});

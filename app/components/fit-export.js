import Ember from 'ember';
import ENV from 'bindfit-client/config/environment';

export default Ember.Component.extend({
    actions: {
        exportFit: function(callback) {
            var _this = this;

            var request = _this.get("fit");

            console.log("actions.exportFit: request to send");
            console.log(request);

            // Send input data to backend for exporting
            var promise = new Ember.RSVP.Promise(function(resolve, reject) {
                Ember.$.ajax({
                    url: ENV.API.export,
                    type: "POST",
                    data: JSON.stringify(request),
                    contentType: "application/json; charset=utf-8",
                    dataType:    "json"
                })
                .done(resolve)
                .fail(reject);
            })

            // For async button
            callback(promise);

            promise.then(
            function(data) {
                // Set exported URL
                _this.get('output').setProperties(data);
            },
            function(error) {
                console.log("actions.exportFit: $.ajax: export failed");
                console.log(error);
            });
        }, // exportFit

        downloadFit: function() {
            // Clear output on download 
            this.get('output').reset();
        } // downloadFit
    } // actions
});

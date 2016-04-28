import Ember from 'ember';
import ENV from 'bindfit-client/config/environment';

export default Ember.Component.extend({
    actions: {
        editFit: function(callback) {
            var _this = this;

            var request = {
                "edit_url": ENV.editURL,
                "id": _this.get("fitID")
            };

            console.log("actions.editFit: request to send");
            console.log(request);
            
            var promise = new Ember.RSVP.Promise(function(resolve, reject) {
                Ember.$.ajax({
                    url:  ENV.API.edit,
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
                console.log("actions.editFit: $.ajax: edit call success");
                console.log(data);
            },
            function(error) {
                console.log("actions.runFitter: $.ajax: edit call failed");
                console.log(error);
            });
        }
    }
});

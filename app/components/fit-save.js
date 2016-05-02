import Ember from 'ember';
import ENV from 'bindfit-client/config/environment';

export default Ember.Component.extend({
    tempUnits: ["C", "K", "F"],
    
    actions: {
        onTempUnitSelect: function(selection) {
            this.set("fit.meta.temp_unit", selection);
            console.log("Temp unit selected");
            console.log(this.get("fit.meta.temp_unit"));
        },

        saveFit: function() {
            var _this = this;

            var request = _this.get("fit");

            console.log("actions.saveFit: FIT ID, FIT EDIT KEY");
            console.log(_this.get("fitID"));
            console.log(_this.get("fitEditKey"));

            request.fit_id       = _this.get("fitID");
            request.fit_edit_key = _this.get("fitEditKey");

            console.log("actions.saveFit: request to send");
            console.log(request);
            console.log("actions.saveFit: request no_fit flag");
            console.log(request.no_fit);

            // Workaround for no_fit == false not getting sent along with
            // other values in the JSON
            // TODO: why is this happening?
            if (request.no_fit === false) {
                request.set('no_fit', 0);
            }

            // Send fitResult to backend for exporting
            Ember.$.ajax({
                url: ENV.API.save,
                type: "POST",
                data: JSON.stringify(request),
                contentType: "application/json; charset=utf-8",
                dataType:    "json"
            })
            .done(function(data) {
                console.log("actions.saveFit: $.ajax: save success");
                console.log(data);

                // Set saved Fit ID
                _this.get('output').setProperties(data);

                // Select and focus generated link
                var url = _this.$("#bindfit-save-output-url");
                console.log(url);
                url.select();
                url.focus();
            })
            .fail(function(error) {
                console.log("actions.saveFit: $.ajax: save fail");
                console.log(error);
            });
        }, // saveFit

        selectURL: function() {
            // TODO trigger this on mouseup in textfield
            console.log("Focused");
            this.$().select();
        } // selectURL
    } // actions
});

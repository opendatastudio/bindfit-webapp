import Ember from 'ember';

export default Ember.Component.extend({
    actions: {
        onTempUnitSelect: function(selection) {
            this.set("meta.temp_unit", selection);
            console.log("Temp unit selected");
            console.log(this.get("meta.temp_unit"));
        },

        saveFit: function() {
            var _this = this;

            var request = _this.get("fit");
            request.meta = _this.get("meta");

            console.log("actions.saveFit: request to send");
            console.log(request);

            // Send fitResult to backend for exporting
            Ember.$.ajax({
                url: "http://api.supramolecular.echus.co/bindfit/fit/save",
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

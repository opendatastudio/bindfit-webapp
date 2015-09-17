import Ember from 'ember';

export default Ember.Component.extend({
    actions: {
        saveFit: function() {
            var _this = this;

            var request = {
                data:    _this.get("data"),
                fit:     _this.get("fit"),
                meta:    _this.get("meta"),
                options: _this.get("options")
            };

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
            })
            .fail(function(error) {
                console.log("actions.saveFit: $.ajax: save fail");
                console.log(error);
            });
        } // saveFit
    } // actions
});

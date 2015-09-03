import Ember from 'ember';

export default Ember.Component.extend({
    actions: {
        saveFit: function() {
            var _this = this;

            var request = {
                result:   _this.get("data"),
                metadata: _this.get("metadata"),
                options:  _this.get("options")
            };

            // Send fitResult to backend for exporting
            Ember.$.ajax({
                url: "http://supramolecular.echus.co/bindfit/api/fit/save",
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

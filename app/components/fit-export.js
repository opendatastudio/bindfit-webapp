import Ember from 'ember';

export default Ember.Component.extend({
    actions: {
        exportFit: function() {
            var _this = this;

            var request = _this.get("fit");

            console.log("actions.exportFit: request to send");
            console.log(request);

            // Send input data to backend for exporting
            Ember.$.ajax({
                url: "http://api.supramolecular.echus.co/bindfit/export",
                type: "POST",
                data: JSON.stringify(request),
                contentType: "application/json; charset=utf-8",
                dataType:    "json"
            })
            .done(function(data) {
                // Set exported URL
                _this.get('output').setProperties(data);
            })
            .fail(function(error) {
                console.log("actions.exportFit: $.ajax: bindfit call failed");
                console.log(error);
            });
        }, // exportFit

        downloadFit: function() {
            // Clear output on download 
            this.get('output').reset();
        } // downloadFit
    } // actions
});

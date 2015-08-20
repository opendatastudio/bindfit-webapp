import Ember from 'ember';

// Constants?
var root = "http://supramolecular.echus.co/bindfit/api/";

export default Ember.Controller.extend({
    uploadPercentage: null,
    uploadComplete:   false,

    actions: {
        onFitterSelect: function(selection) {
            /*** 
             * On fitter select, populate fitOptions and fitLabels models
             * based on selection
             */

            console.log("actions.onFitterSelect: called");
            console.log("actions.onFitterSelect: selection");
            console.log(selection);

            var controller = this;

            // Clear any previous fit options, results and exports
            // Reset upload trackers
            controller.get('fitOptions').reset();
            controller.get('fitResult').reset();
            controller.get('fitExport').reset();
            controller.set('uploadPercentage', null);

            // If a fitter is selected (not undefined)
            if (selection !== undefined) {
                console.log("actions.onFitterSelect: selection !== undefined");

                var request = {"fitter": selection};

                var promises = {
                    labels: Ember.$.ajax({
                        url:  root+"labels",
                        type: "POST",
                        data: JSON.stringify(request),
                        contentType: "application/json; charset=utf-8",
                        dataType:    "json"}),
                    options: Ember.$.ajax({
                        url:  root+"options",
                        type: "POST",
                        data: JSON.stringify(request),
                        contentType: "application/json; charset=utf-8",
                        dataType:    "json"})
                };

                Ember.RSVP.hash(promises).then(function(hash) {
                    controller.fitLabels.setProperties(hash.labels);
                    controller.fitOptions.setProperties(hash.options);
                    console.log("actions.onFitterSelect: RSVP succeeded");
                    console.log("actions.onFitterSelect: fitLables and fitOptions set");
                    console.log(controller.get("fitLabels"));
                    console.log(controller.get("fitOptions"));
                });
            }
        }, // onFitterSelect

        onUploadComplete: function(details) {
            // Set unique file id in fitOptions
            this.set('fitOptions.input.value', details.filename);
            this.set('uploadComplete', true);
        }, // onUploadComplete

        onUploadProgress: function(event) {
            /***
             * Set upload percentage tracker in controller on upload progress
             */

            Ember.run.once(this, function() {
                this.set("uploadPercentage", Math.round(event.percent))
            });
        }, // onUploadProgress

        runFitter: function() {
            var controller = this;

            console.log("actions.runFitter: called");
            console.log("actions.runFitter: current fitOptions TO SEND");
            console.log(controller.get("fitOptions"));

            Ember.$.ajax({
                url:  root+"fit",
                type: "POST",
                data: JSON.stringify(controller.get("fitOptions")),
                contentType: "application/json; charset=utf-8",
                dataType:    "json"
            })
            .done(function(data) {
                console.log("actions.runFitter: $.ajax: bindfit call success");
                console.log(data);

                // Set fit model properties with returned JSON
                controller.fitResult.setProperties(data);

                console.log("actions.runFitter: $.ajax: fit model properties set");
                console.log(controller.fitResult);
            })
            .fail(function(data) {
                console.log("actions.runFitter: $.ajax: bindfit call failed");
                console.log(data);
            });
        }, // runFitter

        exportFit: function() {
            var controller = this;

            var request = {data: controller.get('fitResult')};

            // Send fitResult to backend for exporting
            Ember.$.ajax({
                url:  root+"export",
                type: "POST",
                data: JSON.stringify(request),
                contentType: "application/json; charset=utf-8",
                dataType:    "json"
            })
            .done(function(data) {
                // Set exported URL
                controller.fitExport.setProperties(data);
            })
            .fail(function(error) {
                console.log("actions.exportFit: $.ajax: bindfit call failed");
                console.log(error);
            });
        }, // exportFit

        downloadFit: function() {
            // Clear fitExport on download 
            this.get('fitExport').reset();
        } // downloadFit
    }, // actions
});

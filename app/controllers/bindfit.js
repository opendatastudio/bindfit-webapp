import Ember from 'ember';

// Constants?
var root = "http://supramolecular.echus.co/bindfit/api/";

export default Ember.Controller.extend({
    // Uploader setup
    uploadURL: root+"upload",
    uploadName: "input",



    chartTheme: {
        colors: ["#79BCB8", "#EE6C4D", "#0B4F6C", "#FA8334", "#197BBD", "#033860", "#47A8BD", "#1E3888"],
	chart: {
            marginTop: 50,
            backgroundColor: null,
            style: {'font-family': 'Lato, Helvetica, Arial, Verdana', 'text-transform': 'none'}
	},
	title: {
            style: {
                fontSize: '16px',
                fontWeight: 'bold',
            }
	},
	tooltip: {
            shared: true,
            crosshairs: [true, false],
            borderWidth: 0,
            backgroundColor: 'rgba(219,219,216,0.8)',
            shadow: false
	},
	legend: {
            layout: 'horizontal',
            floating: true,
            align: 'left',
            verticalAlign: 'top',
            borderWidth: 0,
            itemStyle: {
                fontWeight: 'bold',
                fontSize: '14px'
            }
	},
	xAxis: {
            gridLineWidth: 1,
            minorTickInterval: null,
            labels: {
                style: {
                    fontSize: '12px'
                }
            }
	},
	yAxis: {
            gridLineWidth: 1,
            minorTickInterval: null,
            title: {
                style: {
                }
            },
            labels: {
                style: {
                    fontSize: '12px'
                }
            },
            opposite: true,
	},
	plotOptions: {
            candlestick: {
                lineColor: '#404048'
            }
	}
    },



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
            controller.get('fitOptions').reset();
            controller.get('fitResult').reset();
            controller.get('fitExport').reset();

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

        runFitter: function() {
            var controller = this;

            console.log("actions.runFitter: called");
            console.log("actions.runFitter: current fitOptions.params TO SEND");
            console.log(controller.get("fitOptions.params"));

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
        } // exportFit
    }, // actions
});

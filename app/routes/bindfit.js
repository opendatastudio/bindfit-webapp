import Ember from 'ember';
import FitResult  from "../models/fitResult";
import FitLabels  from "../models/fitLabels";
import FitOptions from "../models/fitOptions";
import FitExport  from "../models/fitExport";

export default Ember.Route.extend({
    urls: {
        upload: "http://supramolecular.echus.co/bindfit/api/upload",
        list:   "http://supramolecular.echus.co/bindfit/api/list",
    },

    model: function() {
        var urls = this.urls;

        var model = Ember.RSVP.hash({
            // Fitter models
            fitList:    Ember.$.getJSON(urls.list),
            fitLabels:  FitLabels.create({}),
            fitOptions: FitOptions.create({}),
            fitResult:  FitResult.create({}),
            fitExport:  FitExport.create({}),

            // Uploader settings
            uploadURL:  urls.upload,
            uploadName: "input",

            // Highcharts theme
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
            }
        });

        return model;
    },
       
    setupController: function(controller, model) {
        controller.setProperties(model);
    }
});

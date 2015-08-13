import Ember from 'ember';

// Constants?
var root = "http://supramolecular.echus.co/bindfit/api/";

export default Ember.Controller.extend({
    // Uploader setup
    uploadURL: root+"upload",
    uploadName: "input",

    // Highcharts setup
    chartOptions: {
        chart: {                                                               
            style: {'font-family': 'Lato, Helvetica, Arial, Verdana', 'text-transform': 'none'}
        },                                                                     
        title: {                                                               
            text: "",                                                          
        },                                                                     
        subtitle: {                                                            
            text: "",                                                          
        },                                                                     
        xAxis: {                                                               
            title: {                                                           
                text: "Equivalent total [G]\u2080/[H]\u2080"                   
            },                                                                 
            labels: {                                                          
                format: "{value}"                                              
            }                                                                  
        },                                                                     
        yAxis: { // Primary y axis                                            
            title: {                                                        
                text: "\u03B4", 
            },                                                              
            labels: {                                                       
                format: "{value} ppm"                                           
            },                                                              
            opposite: true,
            //minPadding: 0,                                                  
            //maxPadding: 0,                                                  
            //startOnTick: false,                                             
            //endOnTick: false                                                
        },                                                                 
        tooltip: {                                                          
            shared: true                                                    
        },                                                                  
	legend: {
            layout: 'horizontal',
            floating: true,
            align: 'left',
            verticalAlign: 'top',
            borderWidth: 0,
	},
    },

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
            crosshairs: [true, false],
            borderWidth: 0,
            backgroundColor: 'rgba(219,219,216,0.8)',
            shadow: false
	},
	legend: {
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
            }
	},
	plotOptions: {
            candlestick: {
                lineColor: '#404048'
            }
	}
    },

    chartData: null,

    

    //
    // Initialise options 
    // 

    // Fitter selector
    fitterList: [
        {name: "NMR 1:1", parser: "nmr1to1"},
        {name: "UV 1:2",  parser: "uv1to2"}
    ],

    // Parameters
    params: {
        kGuess: 1000,
        k1Guess: 10000,
        k2Guess: 1000,
    },



    actions: {
        runFitter: function() {
            var controller = this;
            
            var parser = controller.parsers[controller.selectedFitter.parser];
            var request = parser(controller.params);

            console.log(request);

            Ember.$.ajax({
                url: root+"fit",
                type: "POST",
                data: JSON.stringify(request),
                contentType: "application/json; charset=utf-8",
                dataType: "json"
            })
            .done(function(data) {
                console.log("$.ajax: bindfit call success");
                console.log(data);

                var dataToPlot = [];

                var i;
                for (i = 0; i < data.fit.length; i++) {
                    dataToPlot.push({
                        name: "Fit "+String(i+1),
                        type: "spline",
                        marker: {enabled: false},
                        lineWidth: 2,
                        data: data.fit[i]
                    });
                }

                for (i = 0; i < data.data.length; i++) {
                    dataToPlot.push({
                        name: "Data "+String(i+1),
                        type: "line",
                        marker: {enabled: true},
                        lineWidth: 0,
                        data: data.data[i]
                    });
                }

                console.log(dataToPlot);
                controller.set("kFitted", data.k);
                controller.set("chartData", dataToPlot);
            })
            .fail(function(data) {
                console.log("$.ajax: bindfit call failed");
                console.log(data);
            });
        } // runFitter
    }, // actions



    //
    // Custom functions
    //

    parsers: {
        nmr1to1: function(params) {
            // Translate form to request
            var request = {
                "fitter": "nmr1to1",
                "input": {
                    "type": "csv",
                    "value": "input.csv"
                },
                "k_guess": params.kGuess
            };

            return request;
        },

        uv1to2: function(params) {
            var request = {
                "fitter": "uv1to2",
                "input": {
                    "type": "csv",
                    "value": "input.csv"
                },
                "k_guess": [params.k1Guess, params.k2Guess]
            };

            return request;
        }
    }
});

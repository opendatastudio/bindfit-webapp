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
            backgroundColor:null,                                              
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
                style: {'text-transform': 'none'}                           
            },                                                              
            labels: {                                                       
                format: "{value} ppm"                                           
            },                                                              
            //minPadding: 0,                                                  
            //maxPadding: 0,                                                  
            //startOnTick: false,                                             
            //endOnTick: false                                                
        },                                                                 
        tooltip: {                                                          
            shared: true                                                    
        },                                                                  
        legend: {                                                           
            layout: 'vertical',                                             
            floating: true,                                                 
            align: 'left',                                                  
            verticalAlign: 'top',                                           
            x: 70,                                                          
            borderWidth: 0                                                  
        },                                                                  
    },

    chartData: [
    ],


    
    // Initial option values
    kGuess: "1000",

    actions: {
        runFitter: function() {
            var controller = this;

            var kGuess = controller.get("kGuess");
            console.log(kGuess);
            
            // Translate form to request
            var request = {
                "input": {
                    "type": "csv",
                    "value": "input.csv"
                },
                "k_guess": kGuess
            };

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
                        data: data.fit[i]
                    });
                }

                for (i = 0; i < data.data.length; i++) {
                    dataToPlot.push({
                        name: "Data "+String(i+1),
                        type: "scatter",
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
        }
    }
});

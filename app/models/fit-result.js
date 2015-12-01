import Ember from 'ember';

export default Ember.Object.extend({
    data: {
        x: null,
        y: null
    },

    labels: {
        data: {
            x: null,
            y: null
        }
    }, 

    fit:  {
        y: null,
        coeffs: null,
        molefrac: null,
        params: null
    },

    qof: {
        residuals: null,
        cov: null,
        cov_total: null,
        rms: null,
        rms_total: null
    },

    time: null,
    
    meta: {
        author: "",
        name: "",
        date: null,
        timestamp: null,
        ref: "",
        host: "",
        guest: "",
        solvent: "",
        temp: null,
        temp_unit: "C", // Default temperature unit is Celsius
        notes: "" 
    },

    geq: function() {
        var x = this.get("data.x");

        // If data x values are populated
        if (x) {
            // Calculate G/H equivalent concentration
            var geq  = [];
            var h0 = x[0];
            var g0 = x[1];
            for (let i = 0; i < g0.length; i++) {
                geq.push(g0[i]/h0[i]);
            }

            return geq;
        } else {
            return null;
        }
    }.property("data.x"),

    paramsLabelled: function(labels) {
        /***
         * Array of labelled parameters for display in template.
         */
        var params = this.get("fit.params");
        
        console.log("MODEL fitResult.paramsLabelled: called");
        console.log("MODEL fitResult.paramsLabelled: params, labels");
        console.log(params);
        console.log(labels);

        var paramsArray = [];

        // Sort keys to display in order
        var sortedKeys = Object.keys(params).sort();

        // Populate parameter aray
        sortedKeys.forEach(function(key) {
            if (params.hasOwnProperty(key)) {
                paramsArray.push({
                    key:    key,
                    label:  labels[key].label,
                    units:  labels[key].units,
                    value:  params[key].value,
                    init:   params[key].init,
                    stderr: params[key].stderr,
                });
            }
        });

        return paramsArray;
    },

    isPopulated: function() {
        return this.get("time");
    }.property("time"),

    reset: function() {
        // Clear any previous calculated values (not metadata)
        var clear = {
            data: {x: null, y: null},
            labels: {data: {x: null, y: null}},
            fit:  {y: null, coeffs: null, molefrac: null, params: null},
            qof: {residuals: null, 
                  cov: null, cov_total: null, 
                  rms: null, rms_total:null},
            time: null,
            // meta: {
            //     author: "",
            //     name: "",
            //     date: "",
            //     timestamp: null,
            //     ref: "",
            //     host: "",
            //     guest: "",
            //     solvent: "",
            //     temp: null,
            //     temp_unit: "C",
            //     notes: "" 
            // },
        };

        this.setProperties(clear);
    }
});

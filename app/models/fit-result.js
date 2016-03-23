import Ember from 'ember';

export default Ember.Object.extend({
    fitter: null,
    fitter_name: null,
    no_fit: false,
    data_id: null,

    time: null,

    data: {
        x_plot: null,
        x:      null,
        y:      null
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
    
    // Fitter options applied
    options: {
        dilute: null,
    },

    meta: {
        email:     "",
        author:    "",
        name:      "",
        date:      null,
        timestamp: null,
        ref:       "",
        host:      "",
        guest:     "",
        solvent:   "",
        temp:      null,
        temp_unit: "C", // Default temperature unit is Celsius
        notes:     "",

        // Meta options
        options: {
            searchable: false, // Defaut to False
        }
    },

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

        if (params) {
            // Sort keys to display in order
            var sortedKeys = Object.keys(params).sort();

            // Populate parameter aray
            sortedKeys.forEach(function(key) {
                if (params.hasOwnProperty(key)) {
                    let arr = {
                        key:    key,
                        label:  labels[key].label,
                        units:  labels[key].units,
                        value:  params[key].value,
                        init:   params[key].init,
                        stderr: params[key].stderr
                    };

                    // If Monte Carlo error available, add to array
                    if (params[key].hasOwnProperty("mc")) {
                        arr.mc = params[key].mc;
                    }

                    paramsArray.push(arr);
                }
            });
        }

        return paramsArray;
    },

    isPopulated: function() {
        if (this.get("time") || this.get("no_fit")) {
            return true;
        } else {
            return false;
        }
    }.property("time", "no_fit"),

    reset: function() {
        // Clear any previous calculated values (not metadata)
        var _this = this;

        var clear = {
            fitter:  null,
            fitter_name: null,
            no_fit:  false,
            time:     null,
            data_id: null,
            options: {dilute: null},
            data:    {x_plot: null, x: null, y: null},
            labels:  {data: {x: null, y: null}},
            fit:     {y: null, coeffs: null, molefrac: null, params: null},
            qof:     {residuals: null, 
                      cov: null, cov_total: null, 
                      rms: null, rms_total:null},
            // TODO: temp hack - assigning meta: _this.meta directly breaks for a 
            // reason I don't have time to investiage
            meta: {
                email:     _this.meta.email,
                author:    _this.meta.author,
                name:      _this.meta.name,
                date:      _this.meta.date,
                timestamp: _this.meta.timestamp,
                ref:       _this.meta.ref,
                host:      _this.meta.host,
                guest:     _this.meta.guest,
                solvent:   _this.meta.solvent,
                temp:      _this.meta.temp,
                temp_unit: _this.meta.temp_unit,
                notes:     _this.meta.notes,
                options:   {searchable: _this.meta.options.searchable},
            },
        };

        this.setProperties(clear);
    }
});

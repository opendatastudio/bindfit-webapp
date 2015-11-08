import Ember from 'ember';

export default Ember.Object.extend({
    data: {
        x: null,
        y: null
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

    labels: {
        fit: {
            y: {
                row_labels: null,
                axis_label: null,
                axis_units: null
            },
            params: null
        }
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

    paramsLabelled: function() {
        /***
         * Array of labelled parameters for display in template.
         */
        var params = this.get("fit.params");
        var labels = this.get("labels.fit.params");

        var list = [];
        for (var key in params) {
            if (params.hasOwnProperty(key)) {
                list.push({
                    key:   key,
                    label: labels[key].label,
                    units: labels[key].units,
                    value: params[key]
                });
            }
        }

        return list;
    }.property("fit.params", "labels.fit.params"),

    isPopulated: function() {
        return this.get("time");
    }.property("time"),

    reset: function() {
        var clear = {
            data: {x: null, y: null},
            fit:  {y: null, coeffs: null, molefrac: null, params: null},
            qof: {residuals: null, cov: null, cov_total: null, rms: null, rms_total:null},
            time: null,
            labels: {
                fit: {
                    y: {row_labels: null, axis_label: null, axis_units: null}
                }
            }
        };

        this.setProperties(clear);
    }
});

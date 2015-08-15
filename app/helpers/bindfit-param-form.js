import Ember from 'ember';

export default Ember.Handlebars.helper('bindfit-param-form', function(values, labels) {
    console.log("HELPER");
    console.log(values);
    console.log(labels);
    
    var ret = "";

    if (values) {
        for (var i = 0; i < values.length; i++) { 
            ret = new Ember.Handlebars.SafeString(ret + '<p>' + values[i] + '</p>');
        }
    }

    //return ret;
    return inputGroup("hello", "10000", "hello");
}, 'params');

function inputGroup(label, value, units) {
    //return new Ember.Handlebars.SafeString('<div class="input-group col-xs-12"><div class="input-group-addon">' + label + '</div>' + 
    return Ember.Handlebars.helpers.input({"value": value});
}

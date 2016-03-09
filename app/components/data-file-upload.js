import Ember from 'ember';
import ENV from 'bindfit-client/config/environment';

export default Ember.Component.extend({
    // User component options
    onComplete: "onComplete", // Called on upload completion
    onRestart:  "onRestart",  // Called when user re-uploads a new file

    // Currently selected fitter key (used in uploadParams computed prop)
    fitter: "",

    // file-upload component settings 
    uploadURL:    ENV.API.upload,
    uploadName:   "input",

    // Upload state trackers
    uploadPercentage: null,
    uploadComplete:   false,

    uploadParams: function() {
        var params = {
            fitter: this.get('fitter')
        };

        return params;
    }.property('fitter'),

    actions: {
        onUploadProgress: function(event) {
            /***
             * Set upload percentage tracker in controller on upload progress
             */

            // This should happen only on upload restart
            // Reset completion tracker
            if (this.get("uploadComplete")) {
                this.set("uploadComplete", false);
                this.sendAction("onRestart");
            }

            Ember.run.once(this, function() {
                this.set("uploadPercentage", Math.round(event.percent));
            });
        },
        
        onUploadComplete: function(details) {
            /***
             * Set upload completion tracker on completion and run onComplete
             * function.
             */

            this.set("uploadComplete", true);
            this.sendAction("onComplete", details);
        }
    }
});

import Ember from 'ember';
import EmberUploader from 'ember-uploader';

export default EmberUploader.FileField.extend({
    url: '',
    filesDidChange: function(files) {
        var uploadUrl = this.get('url');
        var uploadName = this.get('name');

        var uploader = EmberUploader.Uploader.create({
            url: uploadUrl,
            paramName: uploadName,
            type: 'PUT'
        });

        if (!Ember.isEmpty(files)) {
            uploader.upload(files[0]);
        }
    }
});

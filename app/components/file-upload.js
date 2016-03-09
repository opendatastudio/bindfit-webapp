import Ember from 'ember';
import EmberUploader from 'ember-uploader';

export default EmberUploader.FileField.extend({
    url: "",

    params: {},

    onComplete: 'onComplete',
    onProgress: 'onProgress',

    filesDidChange: function(files) {
        var _this = this;

        var uploadUrl  = _this.get('url');
        var uploadName = _this.get('name');

        var uploader = EmberUploader.Uploader.create({
            url: uploadUrl,
            paramName: uploadName,
            type: 'PUT'
        });

        uploader.on('progress', function(event) {
            _this.sendAction('onProgress', event);
        });

        uploader.on('didUpload', function(response) {
            _this.sendAction('onComplete', response);
        });

        if (!Ember.isEmpty(files)) {
            uploader.upload(files[0], _this.get('params'));
        }
    }
});

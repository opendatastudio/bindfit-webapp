import Ember from 'ember';
import BaseControllerMixin from '../../../mixins/base-controller';
import { module, test } from 'qunit';

module('Unit | Mixin | base controller');

// Replace this with your real tests.
test('it works', function(assert) {
  var BaseControllerObject = Ember.Object.extend(BaseControllerMixin);
  var subject = BaseControllerObject.create();
  assert.ok(subject);
});

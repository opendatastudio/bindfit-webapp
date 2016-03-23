import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';


moduleForComponent('fit-calc-monte-carlo', 'Integration | Component | fit calc monte carlo', {
  integration: true
});

test('it renders', function(assert) {
  assert.expect(2);

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{fit-calc-monte-carlo}}`);

  assert.equal(this.$().text(), '');

  // Template block usage:
  this.render(hbs`
    {{#fit-calc-monte-carlo}}
      template block text
    {{/fit-calc-monte-carlo}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});

import Ember from 'ember';

import SelectPickerMixin from '../helpers/bindfit-select-picker';

var I18nProps = (Ember.I18n && Ember.I18n.TranslateableProperties) || {};

export default Ember.Component.extend(
  SelectPickerMixin, I18nProps,
  {
    classNames: ['select-picker', 'list-picker'],
    selectAllLabel:  'Select All',
    selectNoneLabel: 'Select None',
    nativeMobile: false
  }
);

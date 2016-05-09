import Ember from 'ember';

export default Ember.Component.extend({
  currentPage: null,
  countPages: null,

  actions: {
    pageChanged(current, previous) {
      this.debug("current: " + current + ", previous: " + previous);
      this.debug("countPages: " + this.get("countPages"));
      this.set("currentPage", current);

    }
  },
});

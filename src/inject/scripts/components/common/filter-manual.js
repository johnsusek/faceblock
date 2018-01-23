/* <filter-manual></filter-manual> */

Vue.component('filter-manual', {
  template: html`
    <section id="feedblock-filter-manual">
      <h5>Manual</h5>
      <textarea 
        v-model="newManualPath" 
        type="text" 
        @keyup.enter="applyNewManualPath">
      {{ manualPath }}
    </section>
  `(),
  store: {
    manualPath: CURRENT_NETWORK + '.filters.manualPath'
  },
  data() {
    return {
      newManualPath: ''
    };
  },
  methods: {
    applyNewManualPath() {
      this.manualPath = this.newManualPath;
    }
  }
});

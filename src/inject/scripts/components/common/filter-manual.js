/* <filter-manual></filter-manual> */

Vue.component('filter-manual', {
  template: html`
    <section id="feedblock-filter-manual">
      <input 
        v-model="newManualPath" 
        type="text" 
        @keyup.enter="applyNewManualPath">
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
      this.newManualPath = '';
    }
  }
});

/* <filter-manual></filter-manual> */

Vue.component('filter-manual', {
  template: html`
    <section id="faceblock-filter-manual">
      <h5>Filter</h5>
      {{ manualPath }}
      <input 
        v-model="newManualPath" 
        type="text" 
        @keyup.enter="applyNewManualPath">
    </section>
  `(),
  store: ['manualPath'],
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

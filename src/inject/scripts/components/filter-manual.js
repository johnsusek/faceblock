/* <filter-manual></filter-manual> */

Vue.component('filter-manual', {
  template: html`
    <div id="faceblock-filter-manual">
      Filter: {{ manualPath }}
      <input 
        v-model="newManualPath" 
        type="text" 
        @keyup.enter="applyNewManualPath">
    </div>
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

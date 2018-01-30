Vue.component('filter-manual', {
  template: html`
    <section id="feedblock-filter-manual">
      <h5>Manual</h5>
      <textarea 
        v-model="newManualPath" 
        type="text" 
        @keyup.enter="setManualPath">
      </textarea>
    </section>
  `(),
  props: ['network'],
  data() {
    return {
      newManualPath: ''
    };
  },
  methods: {
    setManualPath() {
      store.commit('MANUAL_PATH_SET', { path: this.newManualPath, network: this.network });
    }
  }
});

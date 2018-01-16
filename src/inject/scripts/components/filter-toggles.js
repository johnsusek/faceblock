/* <filter-toggles> */

Vue.component('filter-toggles', {
  template: html`
    <div>
      <h5>Block</h5>
      <section v-for="toggle in toggles">
        <label>
          <span>
            <input 
              :checked="toggle.checked"
              :value="toggle.value" 
              type="checkbox" 
              @change="toggle.checked = !toggle.checked">
          </span>
          <span>{{ toggle.label }}</span>
        </label>
      </section>
      <section>
        <label>
          <span>
            <input 
              :checked="keywords.checked"
              :value="keywords.value" 
              type="checkbox" 
              @change="keywords.checked = !keywords.checked">
          </span>
          <span>{{ keywords.label }}</span>
        </label>
        <filter-keywords></filter-keywords>
      </section>
    </div>
  `(),
  store: ['toggles', 'keywords']
});

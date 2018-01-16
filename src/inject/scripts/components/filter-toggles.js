/* <filter-toggles> */

Vue.component('filter-toggles', {
  template: html`
    <div>
      <h5>Blocked categories</h5>
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
    </div>
  `(),
  store: ['toggles', 'keywords']
});

/* <filter-toggles> */

Vue.component('filter-toggles', {
  template: html`
    <section id="filter-toggles">
      <h5 title="Check a box to block posts of that type.">Block feed</h5>
      <ul>
        <li v-for="toggle in toggles">
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
        </li>
      </ul>
    </section>
  `(),
  store: {
    toggles: 'facebook.filters.toggles'
  }
});

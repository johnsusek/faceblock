/* <filter-blocklists> */

Vue.component('filter-blocklists', {
  template: html`
    <div id="faceblock-blocklists">
      <section>
        <label>
          <span></span>
          <h5>Blocklists (beta)</h5>
          <ul>
            <li v-for="subscription in blocklists.subscriptions">
              {{ subscription.label }}
              <a @click="removeSubscription(subscription)">x</a>
            </li>
          </ul>
          <div>
            <select v-model="selected">
              <option disabled value=""></option>
              <option :value="list.value" v-for="list in blocklists.lists">
                {{ list.label }}
              </option>
            </select>
            <a @click="addSubscription">Add</a>
            &#183;
            <a @click="previewSubscription">View</a>
          </div>
        </label>
      </section>
    </div>
  `(),
  store: ['blocklists', 'toggles', 'keywords'],
  data() {
    return {
      selected: ''
    };
  },
  methods: {
    addSubscription() {
      // Find the list object
      let list = this.blocklists.lists.find(s => s.value === this.selected);
      // Put it into subscriptions
      this.blocklists.subscriptions.push(list);
      // Remove from available list
      this.blocklists.lists = this.blocklists.lists.filter(s => s.value !== list.value);
      // Finally fetch the list the user requested, which will put it into our state
      window.store.fetchSubscription(list);
    },
    removeSubscription(subscription) {
      // Remove it from the subscriptions
      this.blocklists.subscriptions = this.blocklists.subscriptions.filter(s => s !== subscription);
      // Add it back to the available list
      this.blocklists.lists.push(subscription);
    },
    previewSubscription() {
      let list = this.blocklists.lists.find(s => s.value === this.selected);
      window.open(list.url);
    }
  }
});

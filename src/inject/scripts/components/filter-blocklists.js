/* <filter-blocklists> */

Vue.component('filter-blocklists', {
  template: html`
    <section id="feedblock-blocklists">
      <h5 title="Pre-built lists of common blockwords. Click 'View' to see the list. Click 'Add' to begin blocking any posts that contain any of the words in that blocklist.">Blocklists (beta)</h5>
      <ul>
        <li v-for="subscription in blocklists.subscriptions" v-if="subscription">
          <a target="_blank" :href="subscription.url">{{ subscription.label }}</a>
          <a @click="removeSubscription(subscription)" class="delete">x</a>
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
    </section>
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
      if (!list) {
        return;
      }
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
      if (list) window.open(list.url);
    }
  }
});

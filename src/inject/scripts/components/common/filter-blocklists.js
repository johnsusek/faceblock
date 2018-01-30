Vue.component('filter-blocklists', {
  template: html`
    <section id="feedblock-blocklists">
      <h5 title="Pre-built lists of common blockwords. Click 'View' to see the list. Click 'Add' to begin blocking any posts that contain any of the words in that blocklist.">Blocklists (beta)</h5>
      <ul>
        <li v-for="blocklist in subscribed">
          <a target="_blank" :href="blocklist.url">{{ blocklist.label }}</a>
          <a @click="removeSubscription(blocklist.name)" class="delete">x</a>
        </li>
      </ul>
      <div>
        <select v-model="selected">
          <option disabled value=""></option>
          <option :value="blocklist.name" v-for="blocklist in unsubscribed">
            {{ blocklist.label }}
          </option>
        </select>
        <a id="feedblock-add-sub" @click="addSubscription">Add</a>
        &#183;
        <a id="feedblock-preview-sub" @click="previewSubscription">View</a>
      </div>
    </section>
  `(),

  props: ['network'],

  computed: {
    unsubscribed() {
      return this.$store.getters.unsubscribed;
    },
    subscribed() {
      return this.$store.getters.subscribed;
    }
  },

  data() {
    return {
      selected: ''
    };
  },

  mounted() {
    this.$store.dispatch('SUBSCRIPTION_REFRESH', { subscribed: this.subscribed, network: this.network });
  },

  methods: {
    addSubscription() {
      if (!this.selected) return;
      this.$store.commit('SUBSCRIPTION_ADD', { name: this.selected, network: this.network });
      this.$store.dispatch('SUBSCRIPTION_FETCH', { name: this.selected, network: this.network });
    },
    removeSubscription(name) {
      this.$store.commit('SUBSCRIPTION_REMOVE', { name, network: this.network });
    },
    previewSubscription() {
      let list = this.unsubscribed.find(s => s.name === this.selected);
      if (list) window.open(list.url);
    }
  }
});

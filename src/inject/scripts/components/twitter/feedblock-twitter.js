Vue.component('feedblock-twitter', {
  template: html`
    <div>
      <div id="feedblock" :class="{ open: visible }">
        <h4 :class="{ 'u-textUserColor': visible }" @click="toggleVisibility">
          <span>FeedBlock</span>
          <a>
            <span v-if="visible">Hide</span>
            <span v-else>Show</span>
          </a>
        </h4>
        <div id="feedblock-filters" v-show="visible">
          <filter-keywords network="twitter"></filter-keywords> 
          <filter-hashtags network="twitter"></filter-hashtags> 
          <filter-mentions network="twitter"></filter-mentions> 
          <filter-blocklists network="twitter"></filter-blocklists> 
          <filter-toggles network="twitter"></filter-toggles> 
          <filter-sidebar network="twitter"></filter-sidebar>
          <filter-manual network="twitter"></filter-manual> 
          <filtered-feed></filtered-feed> 
        </div>
        <footer v-show="visible">
          <hr>
          <a href="https://feedblock.declaredintent.com" target="_blank">About</a> &#183; <a href="https://feedblock.declaredintent.com" target="_blank">Contribute</a>
        </footer>
      </div>
    </div>
  `(),

  computed: {
    visible() {
      return this.$store.state.twitter.visible;
    }
  },

  methods: {
    toggleVisibility() {
      store.commit('VISIBILITY_TOGGLE');
    }
  }
});

Vue.component('feedblock-facebook', {
  template: html`
    <div>
      <div id="feedblock" :class="{ open: visible }">
        <h4 id="feedblock-title" @click="toggleVisibility">
          <span>FeedBlock</span>
          <a>
            <span id="feedblock-hide" v-if="visible">Hide</span>
            <span id="feedblock-show" v-else>Show</span>
          </a>
        </h4>
        <div id="feedblock-filters" v-show="visible">
          <filter-keywords network="facebook"></filter-keywords> 
          <filter-blocklists network="facebook"></filter-blocklists> 
          <filter-toggles network="facebook"></filter-toggles> 
          <filter-manual network="facebook"></filter-manual>
          <filter-sidebar network="facebook"></filter-sidebar> 
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
      return this.$store.state.facebook.visible;
    }
  },

  methods: {
    toggleVisibility() {
      store.commit('VISIBILITY_TOGGLE');
    }
  }
});

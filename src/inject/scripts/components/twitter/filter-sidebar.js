/* <filter-sidebar> */

Vue.component('filter-sidebar', {
  template: html`
    <section id="feedblock-sidebar">
      <h5 title="Check a box to block display of that section in the sidebar.">Block sidebar</h5>
      <ul>
        <li>
          <label>
            <input type="checkbox" v-model="hideTrending"> Trending
          </label>      
        </li>
        <li>
          <label>
            <input type="checkbox" v-model="hideWTF"> Who to follow
          </label>      
        </li>
      </ul>
    </section>`(),
  store: {
    hideTrending: 'twitter.filters.sidebar.hideTrending',
    hideWTF: 'twitter.filters.sidebar.hideWTF'
  },
  created() {
    this.toggleTrending();
    this.toggleWTF();
  },
  watch: {
    hideTrending() {
      this.toggleTrending();
    },
    hideWTF() {
      this.toggleWTF();
    }
  },
  methods: {
    toggleTrending() {
      if (this.hideTrending) {
        document.body.classList.add('feedblock_hide_trending');
      } else {
        document.body.classList.remove('feedblock_hide_trending');
      }
    },
    toggleWTF() {
      if (this.hideWTF) {
        document.body.classList.add('feedblock_hide_wtf');
      } else {
        document.body.classList.remove('feedblock_hide_wtf');
      }
    }
  }
});

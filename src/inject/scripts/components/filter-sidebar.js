/* <filter-sidebar> */

Vue.component('filter-sidebar', {
  template: html`
    <section id="feedblock-sidebar">
      <h5 title="Check a box to block display of that section of the right-hand sidebar.">Block sidebar</h5>
      <ul>
        <li>
          <label>
            <input type="checkbox" value="true" v-model="hideTrending"> Trending
          </label>      
        </li>
        <li>
          <label>
            <input type="checkbox" value="true" v-model="hideSponsored"> Sponsored
          </label>      
        </li>
      </ul>
    </section>`(),
  store: {
    hideTrending: 'filters.sidebar.hideTrending',
    hideSponsored: 'filters.sidebar.hideSponsored'
  },
  created() {
    this.toggleTrending();
    this.toggleSponsored();
  },
  watch: {
    hideTrending() {
      this.toggleTrending();
    },
    hideSponsored() {
      this.toggleSponsored();
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
    toggleSponsored() {
      if (this.hideSponsored) {
        document.body.classList.add('feedblock_hide_sponsored');
      } else {
        document.body.classList.remove('feedblock_hide_sponsored');
      }
    }
  }
});

/* <filter-sidebar> */

Vue.component('filter-sidebar', {
  template: html`
    <section id="feedblock-sidebar">
      <h5 title="Check a box to block display of that section in the sidebar.">Block sidebar</h5>
      <ul>
        <li>
          <label>
            <input type="checkbox" v-model="hideFooter"> Footer
          </label>      
        </li>
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
        <li>
          <label>
            <input type="checkbox" v-model="hideLiveVideo"> Live video
          </label>      
        </li>
      </ul>
    </section>`(),
  store: {
    hideFooter: 'twitter.filters.sidebar.hideFooter',
    hideTrending: 'twitter.filters.sidebar.hideTrending',
    hideWTF: 'twitter.filters.sidebar.hideWTF',
    hideLiveVideo: 'twitter.filters.sidebar.hideLiveVideo'
  },
  created() {
    this.toggleFooter();
    this.toggleTrending();
    this.toggleWTF();
    this.toggleLiveVideo();
  },
  watch: {
    hideFooter() {
      this.toggleFooter();
    },
    hideTrending() {
      this.toggleTrending();
    },
    hideWTF() {
      this.toggleWTF();
    },
    hideLiveVideo() {
      this.toggleLiveVideo();
    }
  },
  methods: {
    toggleFooter() {
      if (this.hideFooter) {
        document.body.classList.add('feedblock_hide_footer');
      } else {
        document.body.classList.remove('feedblock_hide_footer');
      }
    },
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
    },
    toggleLiveVideo() {
      if (this.hideLiveVideo) {
        document.body.classList.add('feedblock_hide_livevideo');
      } else {
        document.body.classList.remove('feedblock_hide_livevideo');
      }
    }
  }
});

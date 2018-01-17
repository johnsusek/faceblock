let app = new Vue({
  template: html`
    <div id="faceblock">
      <h4 @click="store.filters.visible = !store.filters.visible">
        <span>FaceBlock</span>
        <a>
          <span v-show="store.filters.visible">Hide</span>
          <span v-show="!store.filters.visible">Show</span>
        </a>
      </h4>
      <filters></filters>
      <filtered-feed></filtered-feed>
      <div>
        <a :href="aboutUrl">About</a>
      </div>
    </div>
  `(),
  data: {
    aboutUrl: chrome.runtime.getURL('about.html'),
    store: window.store.state
  },
  watch: {
    store: {
      handler() {
        this.stateFreeze();
      },
      deep: true
    }
  },
  created() {
    let savedState = this.stateThaw();
    if (savedState) {
      // TODO check version on saved state, and if different, run migration script
      this.store = savedState;
    }
    window.store.refreshSubscriptions(this.store.blocklists.subscriptions);
  },
  methods: {
    stateFreeze() {
      if (this.store) {
        // console.log('Freezing state', JSON.stringify(this.store));
        localStorage.setItem('nocontrol_state', JSON.stringify(this.store));
      }
    },
    stateThaw() {
      // console.log('Thawing state', localStorage.getItem('nocontrol_state'));
      if (localStorage.getItem('nocontrol_state')) {
        return JSON.parse(localStorage.getItem('nocontrol_state') || '{}');
      }
    }
  }
});

let faceblockCheckInterval = setInterval(() => {
  if (document.querySelector('#universalNav')) {
    clearInterval(faceblockCheckInterval);
    document.querySelector('#universalNav').insertAdjacentHTML('afterEnd', '<div id="faceblock-inject"></div>');
    app.$mount('#faceblock-inject');
  }
}, 10);

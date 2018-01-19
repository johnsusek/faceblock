let appConfig = {
  template: html`
    <div>
      <div id="faceblock" :class="{ open: store.filters.visible }">
        <h4 @click="store.filters.visible = !store.filters.visible">
          <span>FaceBlock</span>
          <a>
            <span v-show="store.filters.visible">Hide</span>
            <span v-show="!store.filters.visible">Show</span>
          </a>
        </h4>
        <filters></filters>
        <filtered-feed></filtered-feed>
        <footer v-show="store.filters.visible">
          <hr>
          <a :href="aboutUrl" target="_blank">About</a> &#183; <a :href="aboutUrl" target="_blank">Contribute</a>
        </footer>
      </div>
    </div>
  `(),
  data: {
    aboutUrl: 'https://faceblock.declaredintent.com/about/',
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
        localStorage.setItem('faceblock_state', JSON.stringify(this.store));
      }
    },
    stateThaw() {
      // console.log('Thawing state', localStorage.getItem('faceblock_state'));
      if (localStorage.getItem('faceblock_state')) {
        return JSON.parse(localStorage.getItem('faceblock_state') || '{}');
      }
    }
  }
};

let interval = setInterval(() => {
  if (document.querySelector('#universalNav')) {
    clearInterval(interval);
    if (!document.querySelector('#faceblock')) {
      let app = new Vue(appConfig);
      document.querySelector('#universalNav').insertAdjacentHTML('afterEnd', '<div id="faceblock-inject"></div>');
      app.$mount('#faceblock-inject');
    }
  }
}, 10);

// Wait for the background script to send us a message
chrome.runtime.onMessage.addListener(req => {
  // We'll get injected here on visits to the root url via history.pushState()
  if (req.extensionEvent === 'onHistoryStateUpdated') {
    let interval = setInterval(() => {
      if (document.querySelector('#universalNav')) {
        clearInterval(interval);
        if (!document.querySelector('#faceblock')) {
          let app = new Vue(appConfig);
          document.querySelector('#universalNav').insertAdjacentHTML('afterEnd', '<div id="faceblock-inject"></div>');
          app.$mount('#faceblock-inject');
        }
      }
    }, 10);
  }
});

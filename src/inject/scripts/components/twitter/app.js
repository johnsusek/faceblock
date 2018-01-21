// This is used by common components so they know what store to use when assembling themselves
const CURRENT_NETWORK = 'twitter';

let appConfig = {
  template: html`
    <div>
      <div id="feedblock" :class="{ open: store.twitter.filters.visible }">
        <h4 @click="store.twitter.filters.visible = !store.twitter.filters.visible" :class="{ 'u-textUserColor': store.twitter.filters.visible }">
          <span>FeedBlock</span>
          <a>
            <span v-show="store.twitter.filters.visible">Hide</span>
            <span v-show="!store.twitter.filters.visible">Show</span>
          </a>
        </h4>
        <filters></filters>
        <footer v-show="store.twitter.filters.visible">
          <hr>
          <a :href="aboutUrl" target="_blank">About</a> &#183; <a :href="aboutUrl" target="_blank">Contribute</a>
        </footer>
      </div>
    </div>
  `(),
  data: {
    aboutUrl: 'https://feedblock.declaredintent.com/about/',
    store: window.state
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

    // The version in localStorage might be an old data structure, so we
    // check in our migration function and make sure it is up-to-date
    if (savedState) {
      this.store = window.runMigrations(savedState);
    } else {
      this.store = window.runMigrations(this.store);
    }

    // Freeze the state with any potential changes from migrations
    this.stateFreeze();
  },
  methods: {
    stateFreeze() {
      if (this.store) {
        localStorage.setItem('feedblock_state', JSON.stringify(this.store));
      }
    },
    stateThaw() {
      if (localStorage.getItem('feedblock_state')) {
        return JSON.parse(localStorage.getItem('feedblock_state') || '{}');
      }
    }
  }
};

// Inject immediately (instead of waiting for a message the background script)
// for the case of initial page load, so the UI doesn't flash in
let interval = setInterval(() => {
  if (document.querySelector('.dashboard-left .DashboardProfileCard')) {
    clearInterval(interval);
    if (!document.querySelector('#feedblock')) {
      let app = new Vue(appConfig);
      document
        .querySelector('.dashboard-left .DashboardProfileCard')
        .insertAdjacentHTML('afterEnd', '<div id="feedblock-inject"></div>');
      app.$mount('#feedblock-inject');
    }
  }
}, 10);

// Wait for the background script to send us a message
chrome.runtime.onMessage.addListener(msg => {
  // We'll get injected here on visits to the root url via history.pushState()
  if (msg.extensionEvent === 'onHistoryStateUpdated') {
    let interval = setInterval(() => {
      if (document.querySelector('.dashboard-left .DashboardProfileCard')) {
        clearInterval(interval);
        if (!document.querySelector('#feedblock')) {
          let app = new Vue(appConfig);
          document
            .querySelector('.dashboard-left .DashboardProfileCard')
            .insertAdjacentHTML('afterEnd', '<div id="feedblock-inject"></div>');
          app.$mount('#feedblock-inject');
        }
      }
    }, 10);
  }
});

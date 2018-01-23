// This is used by common components so they know what store to use when assembling themselves
const CURRENT_NETWORK = 'facebook';

let appConfig = {
  template: html`
    <div>
      <div id="feedblock" :class="{ open: store.facebook.filters.visible }">
        <h4 @click="store.facebook.filters.visible = !store.facebook.filters.visible">
          <span>FeedBlock</span>
          <a>
            <span v-show="store.facebook.filters.visible">Hide</span>
            <span v-show="!store.facebook.filters.visible">Show</span>
          </a>
        </h4>
        <filters></filters>
        <footer v-show="store.facebook.filters.visible">
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

    // The version in localStorage might be an old data structure
    if (savedState && savedState.version < 2) {
      this.store = getInitialState();
      this.stateFreeze();
    }
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
  checkInject(interval);
}, 10);

// Wait for the background script to send us a message - for the scenario
// of navigating around the site then returning to the homepage
chrome.runtime.onMessage.addListener(req => {
  // We'll get injected here on visits to the root url via history.pushState()
  if (req.extensionEvent === 'onHistoryStateUpdated') {
    let interval = setInterval(() => {
      checkInject(interval);
    }, 10);
  }
});

// Decides where to inject the UI onto the page
function checkInject() {
  // For debugging, uncomment to inject onto profile pages:
  // let injectionSelector = '.fbTimelineCapsule';
  // let injectionPosition = 'afterBegin';
  let injectionSelector = '#universalNav';
  let injectionPosition = 'afterEnd';

  // Inject to left sidebar of main page
  if (document.querySelector(injectionSelector)) {
    clearInterval(interval);
    // Don't inject if we're already on the page
    if (!document.querySelector('#feedblock')) {
      let app = new Vue(appConfig);
      document
        .querySelector(injectionSelector)
        .insertAdjacentHTML(injectionPosition, '<div id="feedblock-inject"></div>');
      app.$mount('#feedblock-inject');
    }
  }
}

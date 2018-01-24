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
          <a href="https://feedblock.declaredintent.com" target="_blank">About</a> &#183; <a href="https://feedblock.declaredintent.com" target="_blank">Contribute</a>
        </footer>
      </div>
    </div>
  `(),
  data: {
    store: window.state
  },
  watch: {
    store: {
      handler() {
        stateFreeze(this.store);
      },
      deep: true
    }
  },
  created() {
    this.store = stateThaw();
  }
};

function checkInject() {
  clearInterval(interval);
  if (!document.querySelector('#feedblock')) {
    let app = new Vue(appConfig);
    document
      .querySelector('.dashboard-left .DashboardProfileCard')
      .insertAdjacentHTML('afterEnd', '<div id="feedblock-inject"></div>');
    app.$mount('#feedblock-inject');
  }
}

// Inject immediately (instead of waiting for a message the background script)
// for the case of initial page load, so the UI doesn't flash in
let interval = setInterval(() => {
  if (document.querySelector('.dashboard-left .DashboardProfileCard')) {
    checkInject(interval);
  }
}, 10);

// Wait for the background script to send us a message
chrome.runtime.onMessage.addListener(msg => {
  // We'll get injected here on visits to the root url via history.pushState()
  if (msg.extensionEvent === 'onHistoryStateUpdated') {
    let interval = setInterval(() => {
      if (document.querySelector('.dashboard-left .DashboardProfileCard')) {
        checkInject(interval);
      }
    }, 10);
  }
});

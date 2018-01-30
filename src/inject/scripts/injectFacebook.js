let appConfig = {
  template: html`
    <div>
      <feedblock-facebook></feedblock-facebook>
    </div>
  `(),
  store,
  beforeCreate() {
    this.$store.commit('CURRENT_NETWORK_SET', 'facebook');
  }
};

// This script decides if and where to inject the Facebook UI
function checkInject(interval) {
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

// Inject immediately (instead of waiting for a message the background script)
// for the case of initial page load, so the UI doesn't flash in
let intervalFacebookLoad = setInterval(() => {
  checkInject(intervalFacebookLoad);
}, 10);

// Wait for the background script to send us a message - for the scenario
// of navigating around the site then returning to the homepage
chrome.runtime.onMessage.addListener(req => {
  // We'll get injected here on visits to the root url via history.pushState()
  if (req.extensionEvent === 'onHistoryStateUpdated') {
    let intervalFacebookMessage = setInterval(() => {
      checkInject(intervalFacebookMessage);
    }, 10);
  }
});

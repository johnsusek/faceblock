let appConfig = {
  template: html`
    <div>
      <feedblock-twitter></feedblock-twitter>
    </div>
  `(),
  store,
  beforeCreate() {
    store.commit('CURRENT_NETWORK_SET', 'twitter');
  }
};

// This script decides if and where to inject the Twitter UI
function checkInject(interval) {
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
let intervalTwitterLoad = setInterval(() => {
  if (document.querySelector('.dashboard-left .DashboardProfileCard')) {
    checkInject(intervalTwitterLoad);
  }
}, 10);

// Wait for the background script to send us a message
chrome.runtime.onMessage.addListener(msg => {
  // We'll get injected here on visits to the root url via history.pushState()
  if (msg.extensionEvent === 'onHistoryStateUpdated') {
    let intervalTwitterMessage = setInterval(() => {
      if (document.querySelector('.dashboard-left .DashboardProfileCard')) {
        checkInject(intervalTwitterMessage);
      }
    }, 10);
  }
});

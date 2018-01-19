// Inject our content script when the url changes to /
// We don't use the normal script inject for extensions because
// FB is entirely history api driven, so visits to / might come from
// normal page loads, or from pushState()
chrome.webNavigation.onHistoryStateUpdated.addListener(details => {
  // let url = new URL(details.url);
  // The extension is just meant for the homepage
  chrome.tabs.sendMessage(details.tabId, { extensionEvent: 'onHistoryStateUpdated' });
  // if (url.pathname === '/') {
  // Send message to content script
  // }
});

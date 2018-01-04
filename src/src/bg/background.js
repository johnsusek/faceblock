const settings = new Store('settings', {
  sample_setting: 'This is how you use Store.js to remember values'
});

console.log(settings.sample_setting);

// message handler from the inject scripts
chrome.extension.onMessage.addListener((request, sender, sendResponse) => {
  chrome.pageAction.show(sender.tab.id);
  sendResponse();
});

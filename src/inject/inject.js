// TODO
// - translations
// - Change bottom messages visibility when loading complete
// remove filter when url changes from homepage (history api)
// content security policy for xhr
// localstorage remember filter chosen
// include attachments in hide/show rules (not just 'has attachment')
// - "Other"
// - "Everything"
// send error if find a story type, psn, etc that we dont know about...
// explore other roles, stornynames, etc. for ones im missing

let tabsEl = {};

chrome.extension.sendMessage({}, () => {
  const completeCheckInterval = setInterval(() => {
    if (document.readyState === 'complete') {
      clearInterval(completeCheckInterval);
      injectUI();
      bindEvents();
    }
  }, 10);
});

function injectUI() {
  // Place tabs
  document
    .querySelector('#pagelet_composer, #PageComposerPagelet_')
    .insertAdjacentHTML('afterend', window.tabsMarkup());
  tabsEl = document.getElementById('nocontrol-tabs');

  // Place "Please wait" prompt
  [...document.querySelectorAll('a')].filter(a => a.textContent === 'More Stories').forEach(a => {
    a.style.display = 'none';
  });
  document.querySelector('[role="feed"]').insertAdjacentHTML('beforeEnd', window.pleaseWait());
}

function bindEvents() {
  // Tab bar UI
  tabsEl.addEventListener('click', switchTabs);

  // Show or hide posts based on button clicked
  tabsEl.addEventListener('click', modifyBodyClasses);
}

function switchTabs(e) {
  // EXCLUSIVE - remove body classes for all other filters
  document.body.classList.add('nocontrol-filter');
  resetPosts();

  const button = e.target;

  // EXCLUSIVE - clear other buttons underline
  tabsEl.querySelectorAll('.nocontrol-tab-active').forEach(el => {
    el.classList.remove('nocontrol-tab-active');
  });
  button.classList.add('nocontrol-tab-active');
}

function modifyBodyClasses(e) {
  const button = e.target;

  // Add a class to the body
  // data-nocontrol-add="className"
  if (button.dataset.nocontrolAdd) {
    document.body.classList.add(`nocontrol-${button.dataset.nocontrolAdd}`);
  }

  // Remove a class from the body
  // data-nocontrol-remove="className"
  if (button.dataset.nocontrolRemove) {
    document.body.classList.remove(`nocontrol-${button.dataset.nocontrolRemove}`);
  }
}

function resetPosts() {
  document.body.classList.forEach(className => {
    if (className.startsWith('nocontrol-show')) {
      document.body.classList.remove(className);
    }
  });
}

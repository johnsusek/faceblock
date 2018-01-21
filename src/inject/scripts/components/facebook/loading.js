let interactiveCheckInterval = setInterval(() => {
  if (document.readyState === 'complete') {
    clearInterval(interactiveCheckInterval);
    injectLoaderUI();
  }
}, 10);

let loadingMarkup = window.html`
  <div id="feedblock-wait" class="feedblock-panel">
    <div class="feedblock-spinner">
      <div class="feedblock-bounce1"></div>
      <div class="feedblock-bounce2"></div>
      <div class="feedblock-bounce3"></div>
    </div>
    Trying to find additional posts that match filters
    </a>
  </div>
`;

function injectLoaderUI() {
  // Hide native loading
  [...document.querySelectorAll('a')].filter(a => a.textContent === 'More Stories').forEach(a => {
    a.style.display = 'none';
  });

  // Place "Please wait" prompt
  document.querySelector('[role="feed"]') &&
    document.querySelector('[role="feed"]').insertAdjacentHTML('beforeEnd', loadingMarkup());
}

// Watch DOM for the "There are no more posts..." message
// super dirty, but in this case it's the only way to do this
new MutationObserver(mutations => {
  mutations.forEach(mutation => {
    let el = mutation.target;
    if (el.innerText === 'There are no more posts to show right now.') {
      document.querySelector('#feedblock-wait').style.display = 'none';
    } else if (el.innerText.startsWith('{')) {
      try {
        var data = JSON.parse(el.innerText);
        console.log(data);
      } catch (error) {}
    }
  });
}).observe(document, {
  childList: true,
  subtree: true
});

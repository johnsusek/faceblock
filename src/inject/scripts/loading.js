const interactiveCheckInterval = setInterval(() => {
  if (document.readyState === 'complete') {
    clearInterval(interactiveCheckInterval);
    window.injectLoaderUI();
  }
}, 10);

window.loadingMarkup = window.html`
  <div id="nocontrol-wait" class="nocontrol-panel">
    Trying to find additional posts that match filters &#183; <a href="/">
      Clear all filters
    </a>

    <div class="nocontrol-spinner">
      <div class="nocontrol-bounce1"></div>
      <div class="nocontrol-bounce2"></div>
      <div class="nocontrol-bounce3"></div>
    </div>
  </div>
`;

window.injectLoaderUI = function() {
  // Hide native loading
  [...document.querySelectorAll('a')].filter(a => a.textContent === 'More Stories').forEach(a => {
    a.style.display = 'none';
  });
  // Place "Please wait" prompt
  document.querySelector('[role="feed"]').insertAdjacentHTML('beforeEnd', window.loadingMarkup());
};

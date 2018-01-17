let interactiveCheckInterval = setInterval(() => {
  if (document.readyState === 'complete') {
    clearInterval(interactiveCheckInterval);
    injectLoaderUI();
  }
}, 10);

let loadingMarkup = window.html`
  <div id="faceblock-wait" class="faceblock-panel">
    <div class="faceblock-spinner">
      <div class="faceblock-bounce1"></div>
      <div class="faceblock-bounce2"></div>
      <div class="faceblock-bounce3"></div>
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
  document.querySelector('[role="feed"]').insertAdjacentHTML('beforeEnd', loadingMarkup());
}

// TODO: mutation observer to hide this when done loading
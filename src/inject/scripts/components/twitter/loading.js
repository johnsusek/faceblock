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
    <h1>Trying to find additional tweets that match filters</h1>
    </a>
  </div>
`;

function injectLoaderUI() {
  // Place "Please wait" prompt
  document.querySelector('.stream-end') &&
    document.querySelector('.stream-end').insertAdjacentHTML('afterBegin', loadingMarkup());
}

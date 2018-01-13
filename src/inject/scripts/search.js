let searchCheckInterval = setInterval(() => {
  if (document.querySelector('[role="feed"]')) {
    clearInterval(searchCheckInterval);
    injectSearchUI();
  }
}, 10);

let searchMarkup = html`
  <div id="nocontrol-search">
    <input type="text">
    <pre><code class="rainbow"></code></pre>
  </div>
`;

function injectSearchUI() {
  document.querySelector('[role="feed"]').insertAdjacentHTML('afterBegin', searchMarkup());
  document.querySelector('#nocontrol-search input').addEventListener('keydown', e => {
    if (e.which === 13) {
      let postsArray = Object.values(window.posts);
      let result = JSON.stringify(window.jmespath.search(postsArray, e.target.value), null, 2);
      document.querySelector('#nocontrol-search code').innerText = result;
      window.hljs.highlightBlock(document.querySelector('#nocontrol-search code'));
      console.info(window.jmespath.search(postsArray, e.target.value));
    }
  });
}

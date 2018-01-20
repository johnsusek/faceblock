// let searchCheckInterval = setInterval(() => {
//   if (document.querySelector('[role="feed"]')) {
//     clearInterval(searchCheckInterval);
//     injectSearchUI();
//   }
// }, 10);

// let searchMarkup = html`
//   <div id="feedblock-search">
//     <input type="text">
//     <div id="feedblock-search-controls">
//       <button id="feedblock-search-debug">Debug</button>
//       <button id="feedblock-search-set">Set</button>
//     </div>
//     <pre><code class="rainbow"></code></pre>
//   </div>
// `;

// function injectSearchUI() {
//   document
//     .querySelector('[id^="topnews_main_stream"], [id^="feed_stream"], [role="feed"]')
//     .insertAdjacentHTML('afterBegin', searchMarkup());

//   document.querySelector('#feedblock-search input').addEventListener('keydown', e => {
//     if (e.which === 13) {
//       handleDebug();
//     }
//   });

//   document.getElementById('feedblock-search-set').addEventListener('click', handleSet);
//   document.getElementById('feedblock-search-debug').addEventListener('click', handleDebug);
// }

// function handleSet() {
//   window.store.currentFilterPath = document.querySelector('#feedblock-search input').value;
// }

// function handleDebug() {
//   let path = document.querySelector('#feedblock-search input').value;
//   let result = jpath.search(Object.values(window.store.allPosts), path);

//   document.querySelector('#feedblock-search code').innerText = JSON.stringify(result, null, 2);
//   window.hljs.highlightBlock(document.querySelector('#feedblock-search code'));
// }

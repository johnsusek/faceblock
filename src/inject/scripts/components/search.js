// let searchCheckInterval = setInterval(() => {
//   if (document.querySelector('[role="feed"]')) {
//     clearInterval(searchCheckInterval);
//     injectSearchUI();
//   }
// }, 10);

// let searchMarkup = html`
//   <div id="nocontrol-search">
//     <input type="text">
//     <div id="nocontrol-search-controls">
//       <button id="nocontrol-search-debug">Debug</button>
//       <button id="nocontrol-search-set">Set</button>
//     </div>
//     <pre><code class="rainbow"></code></pre>
//   </div>
// `;

// function injectSearchUI() {
//   document
//     .querySelector('[id^="topnews_main_stream"], [id^="feed_stream"], [role="feed"]')
//     .insertAdjacentHTML('afterBegin', searchMarkup());

//   document.querySelector('#nocontrol-search input').addEventListener('keydown', e => {
//     if (e.which === 13) {
//       handleDebug();
//     }
//   });

//   document.getElementById('nocontrol-search-set').addEventListener('click', handleSet);
//   document.getElementById('nocontrol-search-debug').addEventListener('click', handleDebug);
// }

// function handleSet() {
//   window.store.currentFilterPath = document.querySelector('#nocontrol-search input').value;
// }

// function handleDebug() {
//   let path = document.querySelector('#nocontrol-search input').value;
//   let result = jpath.search(Object.values(window.store.allPosts), path);

//   document.querySelector('#nocontrol-search code').innerText = JSON.stringify(result, null, 2);
//   window.hljs.highlightBlock(document.querySelector('#nocontrol-search code'));
// }

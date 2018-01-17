// let searchCheckInterval = setInterval(() => {
//   if (document.querySelector('[role="feed"]')) {
//     clearInterval(searchCheckInterval);
//     injectSearchUI();
//   }
// }, 10);

// let searchMarkup = html`
//   <div id="faceblock-search">
//     <input type="text">
//     <div id="faceblock-search-controls">
//       <button id="faceblock-search-debug">Debug</button>
//       <button id="faceblock-search-set">Set</button>
//     </div>
//     <pre><code class="rainbow"></code></pre>
//   </div>
// `;

// function injectSearchUI() {
//   document
//     .querySelector('[id^="topnews_main_stream"], [id^="feed_stream"], [role="feed"]')
//     .insertAdjacentHTML('afterBegin', searchMarkup());

//   document.querySelector('#faceblock-search input').addEventListener('keydown', e => {
//     if (e.which === 13) {
//       handleDebug();
//     }
//   });

//   document.getElementById('faceblock-search-set').addEventListener('click', handleSet);
//   document.getElementById('faceblock-search-debug').addEventListener('click', handleDebug);
// }

// function handleSet() {
//   window.store.currentFilterPath = document.querySelector('#faceblock-search input').value;
// }

// function handleDebug() {
//   let path = document.querySelector('#faceblock-search input').value;
//   let result = jpath.search(Object.values(window.store.allPosts), path);

//   document.querySelector('#faceblock-search code').innerText = JSON.stringify(result, null, 2);
//   window.hljs.highlightBlock(document.querySelector('#faceblock-search code'));
// }

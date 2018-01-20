// let tabsCheckInterval = setInterval(() => {
//   if (document.querySelector('[role="feed"]')) {
//     clearInterval(tabsCheckInterval);
//     injectFilterUI();
//   }
// }, 10);

// let tabsMarkup = window.html`
//   <div id="feedblock-filters">
//     <div id="feedblock-tabs">
//       <ul>
//         <li>
//           <a data-feedblock-query="[]" class="feedblock-tab-active">All</a>
//         </li>
//         <li>
//           <a data-feedblock-query="[? ( (  meta.page_insight == null ) ) ]">Friends</a>
//         </li>
//         <li>
//           <a data-feedblock-query="[? ( (  meta.page_insight != null ) ) ]">Pages</a>
//         </li>
//         <li>
//           <a data-feedblock-query="[? ( (  meta.page_insight &amp;&amp; starts_with(meta.page_insight.psn, \`EntGroup\`)) ) ]">Groups</a>
//         </li>
//       </ul>
//     </div>
//     <div id="feedblock-toggles">
//       <label>
//         <input type="checkbox" data-feedblock-and="isSponsored" checked="checked">
//         Suggested
//       </label>
//     </div>
//   </div>
// `;

// function injectFilterUI() {
//   // Place tabs
//   document
//     .querySelector('[id^="topnews_main_stream"], [id^="feed_stream"], [role="feed"]')
//     .insertAdjacentHTML('afterBegin', tabsMarkup());

//   // Toggles
//   document.getElementById('feedblock-toggles').addEventListener('change', e => {
//     handleToggles(e);
//   });

//   // Tabs
//   document.getElementById('feedblock-tabs').addEventListener('click', e => {
//     switchTabClass(e);
//     console.log(e.target.dataset);
//     if (e.target.dataset.feedblockQuery) {
//       // TODO: validation of query
//       window.store.currentFilterPath = e.target.dataset.feedblockQuery;
//     }
//   });
// }

// function handleToggles(e) {
//   // Check each toggle, do the proper thing
//   let toggle = e.target.querySelector('input') || e.target;
//   console.log(toggle.checked);
// }

// function switchTabClass(e) {
//   let button = e.target;
//   button
//     .closest('ul')
//     .querySelectorAll('.feedblock-tab-active')
//     .forEach(el => {
//       el.classList.remove('feedblock-tab-active');
//     });
//   button.classList.add('feedblock-tab-active');
// }

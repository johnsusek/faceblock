// let tabsCheckInterval = setInterval(() => {
//   if (document.querySelector('[role="feed"]')) {
//     clearInterval(tabsCheckInterval);
//     injectFilterUI();
//   }
// }, 10);

// let tabsMarkup = window.html`
//   <div id="nocontrol-filters">
//     <div id="nocontrol-tabs">
//       <ul>
//         <li>
//           <a data-nocontrol-query="[]" class="nocontrol-tab-active">All</a>
//         </li>
//         <li>
//           <a data-nocontrol-query="[? ( (  meta.page_insight == null ) ) ]">Friends</a>
//         </li>
//         <li>
//           <a data-nocontrol-query="[? ( (  meta.page_insight != null ) ) ]">Pages</a>
//         </li>
//         <li>
//           <a data-nocontrol-query="[? ( (  meta.page_insight &amp;&amp; starts_with(meta.page_insight.psn, \`EntGroup\`)) ) ]">Groups</a>
//         </li>
//       </ul>
//     </div>
//     <div id="nocontrol-toggles">
//       <label>
//         <input type="checkbox" data-nocontrol-and="isSponsored" checked="checked">
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
//   document.getElementById('nocontrol-toggles').addEventListener('change', e => {
//     handleToggles(e);
//   });

//   // Tabs
//   document.getElementById('nocontrol-tabs').addEventListener('click', e => {
//     switchTabClass(e);
//     console.log(e.target.dataset);
//     if (e.target.dataset.nocontrolQuery) {
//       // TODO: validation of query
//       window.store.currentFilterPath = e.target.dataset.nocontrolQuery;
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
//     .querySelectorAll('.nocontrol-tab-active')
//     .forEach(el => {
//       el.classList.remove('nocontrol-tab-active');
//     });
//   button.classList.add('nocontrol-tab-active');
// }

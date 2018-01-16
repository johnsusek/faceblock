// let queryCheckInterval = setInterval(() => {
//   if (document.querySelector('[role="feed"]')) {
//     clearInterval(queryCheckInterval);
//     injectQueryUI();
//   }
// }, 10);

// let queryMarkup = html`
//   <div id="nocontrol-query" class="nocontrol-panel">
//     <div id="nocontrol-querybuilder"></div>
//     <div id="nocontrol-querybuilder-controls">
//       <button id="nocontrol-filter-debug">Debug</button>
//       <button id="nocontrol-filter-set">Set</button>
//     </div>
//     <pre><code class="rainbow"></code></pre>
//   </div>
// `;

// const queryBuilderFilters = [
//   {
//     id: 'id',
//     label: 'id',
//     type: 'string'
//   },
//   {
//     id: 'text',
//     label: 'text',
//     type: 'string'
//   },
//   {
//     id: 'timestamp',
//     label: 'timestamp',
//     type: 'integer'
//   },
//   {
//     id: 'external_links',
//     label: 'external_links',
//     type: 'integer'
//   },
//   {
//     id: 'profiles',
//     label: 'profiles',
//     type: 'string'
//   },
//   {
//     id: 'hovercards',
//     label: 'hovercards',
//     type: 'string'
//   },
//   {
//     id: 'meta.page_insight',
//     label: 'meta.page_insight',
//     type: 'boolean'
//   },
//   {
//     id: 'meta.fbfeed_location',
//     label: 'meta.fbfeed_location',
//     type: 'integer'
//   },
//   {
//     id: 'meta.call_to_action_type',
//     label: 'meta.call_to_action_type',
//     type: 'string'
//   },
//   {
//     id: 'meta.is_sponsored',
//     label: 'meta.is_sponsored',
//     type: 'string'
//   },
//   {
//     id: 'meta.page_insight.psn',
//     label: 'meta.page_insight.psn',
//     type: 'string'
//   },
//   {
//     id: 'meta.page_insight.role',
//     label: 'meta.page_insight.role',
//     type: 'integer'
//   },
//   {
//     id: 'meta.page_insight.sl',
//     label: 'meta.page_insight.sl',
//     type: 'integer'
//   },
//   {
//     id: 'meta.page_insight.post_context.object_fbtype',
//     label: 'meta.page_insight.post_context.object_fbtype',
//     type: 'integer'
//   },
//   {
//     id: 'meta.page_insight.post_context.publish_time',
//     label: 'meta.page_insight.post_context.publish_time',
//     type: 'integer'
//   },
//   {
//     id: 'meta.page_insight.post_context.story_name',
//     label: 'meta.page_insight.post_context.story_name',
//     type: 'string'
//   }
// ];

// function injectQueryUI() {
//   document
//     .querySelector('[id^="topnews_main_stream"], [id^="feed_stream"], [role="feed"]')
//     .insertAdjacentHTML('afterBegin', queryMarkup());

//   window.jQuery('#nocontrol-querybuilder').queryBuilder({
//     filters: queryBuilderFilters
//   });

//   document.getElementById('nocontrol-filter-set').addEventListener('click', handleSet);
//   document.getElementById('nocontrol-filter-debug').addEventListener('click', handleDebug);
// }

// function handleSet() {
//   let rules = window.jQuery('#nocontrol-querybuilder').queryBuilder('getRules');

//   if (!rules) {
//     return;
//   }

//   const path = createPathFromRules([rules]);

//   if (!path) {
//     return;
//   }

//   window.store.currentFilterPath = path;
// }

// function handleDebug() {
//   let rules = window.jQuery('#nocontrol-querybuilder').queryBuilder('getRules');
//   let queryResult = runQueryFromRules(rules);
//   document.querySelector('#nocontrol-query code').innerText = JSON.stringify(queryResult, null, 2);
//   window.hljs.highlightBlock(document.querySelector('#nocontrol-query code'));
// }

// function runQueryFromRules(rules) {
//   if (!rules) {
//     return;
//   }

//   const path = createPathFromRules([rules]);
//   let ruleResult = window.jpath.search(Object.values(window.store.allPosts), path);

//   return ruleResult;
// }

// function createPathFromRules(rules) {
//   let query = '[? ' + rulesToPath(rules) + ' ]';
//   console.log(query);
//   return query;
// }

// function rulesToPath(rules, conditional) {
//   console.log('Creating a path from these rules and this conditional!', rules, conditional);

//   let ruleStr = '( ';

//   let separator = conditional === 'AND' ? ' && ' : ' || ';

//   rules.forEach((rule, index) => {
//     if (rule.rules && rule.condition) {
//       ruleStr += rulesToPath(rule.rules, rule.condition);
//     }

//     if (!rule.operator) {
//       return;
//     }

//     let lq = '`';
//     let rq = '`';

//     if (rules.type === 'string') {
//       lq = "'";
//       rq = "'";
//     }

//     switch (rule.operator) {
//       case 'equal':
//         ruleStr += `${index > 0 ? separator : ''} ${rule.field} == ${lq}${rule.value}${rq}`;
//         break;
//       case 'not_equal':
//         ruleStr += `${index > 0 ? separator : ''} ${rule.field} != ${lq}${rule.value}${rq}`;
//         break;
//       case 'in':
//         ruleStr += `${index > 0 ? separator : ''} contains([${rule.value}], ${rule.field})`;
//         break;
//       case 'not_in':
//         ruleStr += `${index > 0 ? separator : ''} !contains([${rule.value}], ${rule.field})`;
//         break;
//       case 'begins_with':
//         ruleStr += `${index > 0 ? separator : ''} starts_with(${rule.field}, ${lq}${rule.value}${rq}) == \`true\``;
//         break;
//       case 'not_begins_with':
//         ruleStr += `${index > 0 ? separator : ''} !starts_with(${rule.field}, ${lq}${rule.value}${rq}) == \`true\``;
//         break;
//       case 'contains':
//         ruleStr += `${index > 0 ? separator : ''} contains(${rule.field}, ${lq}${rule.value}${rq}) == \`true\``;
//         break;
//       case 'not_contains':
//         ruleStr += `${index > 0 ? separator : ''} !contains(${rule.field}, ${lq}${rule.value}${rq}) == \`true\``;
//         break;
//       case 'ends_with':
//         ruleStr += `${index > 0 ? separator : ''} ends_with(${rule.field}, ${lq}${rule.value}${rq}) == \`true\``;
//         break;
//       case 'not_ends_with':
//         ruleStr += `${index > 0 ? separator : ''} !ends_with(${rule.field}, ${lq}${rule.value}${rq}) == \`true\``;
//         break;
//       case 'is_empty':
//         ruleStr += `${index > 0 ? separator : ''} ${rule.field} == ''`;
//         break;
//       case 'is_not_empty':
//         ruleStr += `${index > 0 ? separator : ''} ${rule.field} != ''`;
//         break;
//       case 'is_null':
//         ruleStr += `${index > 0 ? separator : ''} ${rule.field} == null`;
//         break;
//       case 'is_not_null':
//         ruleStr += `${index > 0 ? separator : ''} ${rule.field} != null`;
//         break;
//       default:
//         console.error('could not find an operator transform for operation', rule.operator, rule);
//     }
//   });

//   ruleStr += ' )';

//   return ruleStr;
// }

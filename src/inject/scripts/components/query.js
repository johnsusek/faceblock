let queryCheckInterval = setInterval(() => {
  if (document.querySelector('[role="feed"]')) {
    clearInterval(queryCheckInterval);
    injectQueryUI();
  }
}, 10);

let queryMarkup = html`
  <div id="nocontrol-query" class="nocontrol-panel">
    <div id="nocontrol-querybuilder"></div>
    <div id="nocontrol-querybuilder-controls">
      <button id="nocontrol-filter-apply">Apply</button>
      <button id="nocontrol-filter-debug">Debug</button>
      <button id="nocontrol-filter-set">Set</button>
    </div>
    <pre><code class="rainbow"></code></pre>
  </div>
`;

const queryBuilderFilters = [
  {
    id: 'text',
    label: 'text',
    type: 'string'
  },
  {
    id: 'elId',
    label: 'el id',
    type: 'string'
  },
  {
    id: 'elMeta.timestamp',
    label: 'timestamp',
    type: 'integer'
  },
  {
    id: 'elMeta.fte',
    label: 'el meta fte',
    type: 'integer',
    input: 'radio',
    values: {
      1: 'Yes',
      0: 'No'
    },
    operators: ['equal']
  }
];

function injectQueryUI() {
  document.querySelector('[role="feed"]').insertAdjacentHTML('afterBegin', queryMarkup());

  window.jQuery('#nocontrol-querybuilder').queryBuilder({
    filters: queryBuilderFilters
  });

  document.getElementById('nocontrol-filter-set').addEventListener('click', handleSet);
  document.getElementById('nocontrol-filter-apply').addEventListener('click', handleApply);
  document.getElementById('nocontrol-filter-debug').addEventListener('click', handleDebug);
}

function handleSet() {
  let rules = window.jQuery('#nocontrol-querybuilder').queryBuilder('getRules');

  if (!rules) {
    return;
  }

  const path = createPathFromRules([rules]);

  if (!path) {
    return;
  }

  window.store.currentFilterPath = path;
  window.store.onUpdate();
}

function handleApply() {
  let queryResult = runQuery();

  if (!queryResult) {
    return;
  }

  document.querySelector('[role="feed"]').style.transition = 'opacity 1s';
  document.querySelector('[role="feed"]').style.opacity = 0.5;
  setTimeout(() => {
    displayQueryResult(queryResult);
  }, 10);
}

function displayQueryResult(queryResult) {
  // hide the feed to prevent reflows
  document.querySelector('[role="feed"]').style.display = 'none';
  console.log('displayQueryResult', queryResult);

  // loop through every post on the page, hiding them
  let postMap = Object.values(window.posts);
  postMap.forEach(hidePost);

  // now loop through the query results, just showing them
  queryResult.forEach(showPost);

  // show the feed again now that we've modified it
  document.querySelector('[role="feed"]').style.display = 'block';
  document.querySelector('[role="feed"]').style.opacity = 1;
}

function showPost(post) {
  document.getElementById(post.elId).style.display = 'block';
}

function hidePost(post) {
  document.getElementById(post.elId).style.display = 'none';
}

function handleDebug() {
  let queryResult = runQuery();
  document.querySelector('#nocontrol-query code').innerText = JSON.stringify(queryResult, null, 2);
  window.hljs.highlightBlock(document.querySelector('#nocontrol-query code'));
}

function runQuery() {
  let rules = window.jQuery('#nocontrol-querybuilder').queryBuilder('getRules');

  if (!rules) {
    return;
  }

  const path = createPathFromRules([rules]);
  let ruleResult = window.jmespath.search(Object.values(window.posts), path);

  return ruleResult;
}

function createPathFromRules(rules) {
  let query = '[? ';
  query += rulesToPath(rules);
  query += ' ]';
  console.log(query);
  return query;
}

function rulesToPath(rules, conditional) {
  console.log('Creating a path from these rules and this conditional!', rules, conditional);

  let ruleStr = '( ';

  let separator = conditional === 'AND' ? ' && ' : ' || ';

  rules.forEach((rule, index) => {
    if (rule.rules && rule.condition) {
      ruleStr += rulesToPath(rule.rules, rule.condition);
    }
    if (!rule.operator) {
      return;
    }
    switch (rule.operator) {
      case 'equal':
        ruleStr += `${index > 0 ? separator : ''} ${rule.field} == '${rule.value}'`;
        break;
      case 'not_equal':
        ruleStr += `${index > 0 ? separator : ''} ${rule.field} != '${rule.value}'`;
        break;
      case 'in':
        ruleStr += `${index > 0 ? separator : ''} contains([${rule.value}], ${rule.field})`;
        break;
      case 'not_in':
        ruleStr += `${index > 0 ? separator : ''} !contains([${rule.value}], ${rule.field})`;
        break;
      case 'begins_with':
        ruleStr += `${index > 0 ? separator : ''} starts_with(${rule.field}, '${rule.value}') == \`true\``;
        break;
      case 'not_begins_with':
        ruleStr += `${index > 0 ? separator : ''} !starts_with(${rule.field}, '${rule.value}') == \`true\``;
        break;
      case 'contains':
        ruleStr += `${index > 0 ? separator : ''} contains(${rule.field}, '${rule.value}') == \`true\``;
        break;
      case 'not_contains':
        ruleStr += `${index > 0 ? separator : ''} !contains(${rule.field}, '${rule.value}') == \`true\``;
        break;
      case 'ends_with':
        ruleStr += `${index > 0 ? separator : ''} ends_with(${rule.field}, '${rule.value}') == \`true\``;
        break;
      case 'not_ends_with':
        ruleStr += `${index > 0 ? separator : ''} !ends_with(${rule.field}, '${rule.value}') == \`true\``;
        break;
      case 'is_empty':
        ruleStr += `${index > 0 ? separator : ''} ${rule.field} == ''`;
        break;
      case 'is_not_empty':
        ruleStr += `${index > 0 ? separator : ''} ${rule.field} != ''`;
        break;
      case 'is_null':
        ruleStr += `${index > 0 ? separator : ''} ${rule.field} == null`;
        break;
      case 'is_not_null':
        ruleStr += `${index > 0 ? separator : ''} ${rule.field} != null`;
        break;
      default:
        console.error('could not find an operator transform for operation', rule.operator, rule);
    }
  });

  ruleStr += ' )';

  return ruleStr;
}

let queryCheckInterval = setInterval(() => {
  if (document.querySelector('[role="feed"]')) {
    clearInterval(queryCheckInterval);
    injectQueryUI();
  }
}, 10);

let queryMarkup = html`
  <div id="nocontrol-query" class="nocontrol-panel">
    <div id="nocontrol-querybuilder"></div>
    <button id="nocontrol-filter-apply">Apply</button>
    <pre><code class="rainbow"></code></pre>
  </div>
`;

function injectQueryUI() {
  document.querySelector('[role="feed"]').insertAdjacentHTML('afterBegin', queryMarkup());

  window.jQuery('#nocontrol-querybuilder').queryBuilder({
    // plugins: ['bt-tooltip-errors'],

    filters: [
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
      // {
      //   id: 'category',
      //   label: 'Category',
      //   type: 'integer',
      //   input: 'select',
      //   values: {
      //     1: 'Books',
      //     2: 'Movies',
      //     3: 'Music',
      //     4: 'Tools',
      //     5: 'Goodies',
      //     6: 'Clothes'
      //   },
      //   operators: ['equal', 'not_equal', 'in', 'not_in', 'is_null', 'is_not_null']
      // },
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
    ]
  });

  document.getElementById('nocontrol-filter-apply').addEventListener('click', () => {
    let rules = window.jQuery('#nocontrol-querybuilder').queryBuilder('getRules');

    if (!rules) {
      return;
    }

    const query = createQueryFromRules([rules]);
    let ruleResult = window.jmespath.search(Object.values(window.posts), query);
    document.querySelector('#nocontrol-query code').innerText = JSON.stringify(ruleResult, null, 2);
    window.hljs.highlightBlock(document.querySelector('#nocontrol-query code'));
  });
}

function createQueryFromRules(rules) {
  let query = '[? ';
  query += rulesToPath(rules);
  query += ' ]';
  console.log(query);
  return query;
}

// 100% functional
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

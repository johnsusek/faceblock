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
        id: 'elId',
        label: 'el id',
        type: 'string'
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
    let postsArray = Object.values(window.posts);

    if (!rules.valid) {
      return;
    }

    let debugResult;

    if (rules.condition === 'AND') {
      let paths = [];
      rules.rules.forEach(rule => paths.push(ruleToPath(rule)));
      let path = paths.join(' | ');
      let ruleResult = window.jmespath.search(postsArray, path);

      debugResult = JSON.stringify(ruleResult, null, 2);
    } else if (rules.condition === 'OR') {
      let results = [];

      // Build an array of all results, for each of the "OR" conditions
      rules.rules.forEach(rule => {
        let path = ruleToPath(rule);
        let ruleResult = window.jmespath.search(postsArray, path);
        ruleResult.forEach(r => results.push(r));
      });

      // De-dupe that array, for multiple negated queries
      results = results.filter((r, i, self) => self.findIndex(t => t.id === r.id) === i);

      debugResult = JSON.stringify(results, null, 2);
    }

    document.querySelector('#nocontrol-query code').innerText = debugResult;
    window.hljs.highlightBlock(document.querySelector('#nocontrol-query code'));
  });
}

function ruleToPath(rule) {
  console.log(rule);
  // Assume: string operator
  switch (rule.operator) {
    case 'equal':
      return `[?${rule.field}=='${rule.value}']`;
    case 'not_equal':
      return `[?${rule.field}!='${rule.value}']`;
    case 'in':
      return `[?contains([${rule.value}], ${rule.field})]`;
    case 'not_in':
      return `[?!contains([${rule.value}], ${rule.field})]`;
    case 'begins_with':
      return `[?starts_with(${rule.field}, '${rule.value}') == \`true\`]`;
    case 'not_begins_with':
      return `[?!starts_with(${rule.field}, '${rule.value}') == \`true\`]`;
    case 'contains':
      return `[?contains(${rule.field}, '${rule.value}') == \`true\`]`;
    case 'not_contains':
      return `[?!contains(${rule.field}, '${rule.value}') == \`true\`]`;
    case 'ends_with':
      return `[?ends_with(${rule.field}, '${rule.value}') == \`true\`]`;
    case 'not_ends_with':
      return `[?!ends_with(${rule.field}, '${rule.value}') == \`true\`]`;
    case 'is_empty':
    case 'is_null':
      return "==''";
    case 'is_not_empty':
    case 'is_not_null':
      return "!=''";
    default:
      console.error('could not find an operator transform');
  }
}

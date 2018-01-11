const posts = {};
let currentFilter = 'all';

const observer = new MutationObserver(mutations => {
  mutations.forEach(mutation => {
    if (
      mutation.target.dataset &&
      mutation.target.dataset.dedupekey &&
      mutation.oldValue &&
      mutation.oldValue.startsWith('{')
    ) {
      const post = {
        elId: mutation.target.id,
        elMeta: mutation.target.dataset,
        meta: JSON.parse(mutation.oldValue)
      };
      // Just for debugging, save the data to attribute
      mutation.target.title = JSON.stringify(post.meta, null, 2);
      // Put into our list of posts for later filtering
      posts[mutation.target.dataset.dedupekey] = post;
      // Hide/show depending on any filters currently applied
      hidePostOnFilterCriteria(post, currentFilter);
    }
  });
});

observer.observe(document, {
  attributeFilter: ['data-ft'],
  attributeOldValue: true,
  attributes: true,
  subtree: true
});

const completeCheckInterval = setInterval(() => {
  if (document.querySelector('[role="feed"]')) {
    clearInterval(completeCheckInterval);

    // Hide native loading
    [...document.querySelectorAll('a')].filter(a => a.textContent === 'More Stories').forEach(a => {
      a.style.display = 'none';
    });

    // Place "Please wait" prompt
    document.querySelector('[role="feed"]').insertAdjacentHTML('beforeEnd', loadingMarkup());

    // Place tabs
    document.querySelector('[role="feed"]').insertAdjacentHTML('beforeBegin', tabsMarkup());

    document.getElementById('nocontrol-tabs').addEventListener('click', e => {
      document.querySelector('[role="feed"]').style.transition = 'opacity 1s';

      document.querySelector('[role="feed"]').style.opacity = 0.5;
      switchTabs(e);
      setTimeout(() => {
        applyFilter(e);
      }, 10);
    });
  }
}, 10);

function switchTabs(e) {
  const button = e.target;
  button
    .closest('ul')
    .querySelectorAll('.nocontrol-tab-active')
    .forEach(el => {
      el.classList.remove('nocontrol-tab-active');
    });
  button.classList.add('nocontrol-tab-active');
}

function applyFilter(e) {
  const button = e.target;

  if (button.dataset.nocontrolFilter) {
    currentFilter = button.dataset.nocontrolFilter;

    // hide the feed to prevent reflows
    document.querySelector('[role="feed"]').style.display = 'none';
    console.log('Applying filter', currentFilter);

    // loop through every post on the page
    const postMap = new Map(Object.entries(posts));
    postMap.forEach(post => {
      hidePostOnFilterCriteria(post, currentFilter);
    });

    // show the feed again now that we've modified it
    document.querySelector('[role="feed"]').style.display = 'block';
    document.querySelector('[role="feed"]').style.opacity = 1;
  }
}

function hidePostOnFilterCriteria(post, criteria) {
  if (!criteria) {
    document.getElementById(post.elId).style.display = 'block';
  } else if (!filters[criteria]) {
    console.error('Could not find filter for', criteria);
  } else if (filters[criteria](post)) {
    document.getElementById(post.elId).style.display = 'block';
  } else {
    document.getElementById(post.elId).style.display = 'none';
  }
}

const filters = {
  all() {
    return true;
  },
  isFriend(post) {
    return !post.meta.page_insights;
  },
  isPage(post) {
    return post.meta.page_insights;
  },
  isGroup(post) {
    const meta = post.meta;
    if (!meta.page_insights || !meta.page_insights[meta.page_id]) {
      return false;
    } else if (meta.page_insights[meta.page_id].psn && meta.page_insights[meta.page_id].psn.startsWith('EntGroup')) {
      return true;
    } else if (
      meta.page_insights[meta.page_id].post_context &&
      meta.page_insights[meta.page_id].post_context.story_name &&
      meta.page_insights[meta.page_id].post_context.story_name.startsWith('EntGroup')
    ) {
      return true;
    }
    return false;
  },
  isSponsored(post) {
    return post.meta.is_sponsored;
  }
};

const tabsMarkup = html`
  <div id="nocontrol">
    <div id="nocontrol-tabs">
      <ul>
        <li>
          <a data-nocontrol-filter="all" class="nocontrol-tab-active">All</a>
        </li>
        <li>
          <a data-nocontrol-filter="isFriend">Friends</a>
        </li>
        <li>
          <a data-nocontrol-filter="isPage">Pages</a>
        </li>
        <li>
          <a data-nocontrol-filter="isGroup">Groups</a>
        </li>
      </ul>
      <div id="nocontrol-toggles">
        <label>
          <input type="checkbox" data-nocontrol-filter="isSponsored">
          Sponsored
        </label>
      </div>
    </div>
  </div>
`;
const loadingMarkup = html`
  <div id="nocontrol-wait" class="nocontrol-panel">
    Trying to find additional posts that match filters &#183; <a href="/">
      Clear all filters
    </a>

    <div class="nocontrol-spinner">
      <div class="nocontrol-bounce1"></div>
      <div class="nocontrol-bounce2"></div>
      <div class="nocontrol-bounce3"></div>
    </div>
  </div>
`;

// let template = html`Hello ${"foo"}!`;
// template({ foo: "World" }); // "Hello World!"
function html(strings, ...keys) {
  return function(...values) {
    if (!values) {
      return '';
    }
    const dict = values[values.length - 1] || {};
    const result = [strings[0]];
    keys.forEach((key, i) => {
      const value = Number.isInteger(key) ? values[key] : dict[key];
      result.push(value, strings[i + 1]);
    });
    return result.join('');
  };
}

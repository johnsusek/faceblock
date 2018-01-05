// TODO
// - translations
// - "Other"
// - "Everything"
// - Suggestions tab

const observer = new MutationObserver(mutations => {
  mutations.forEach(mutation => {
    if (mutation.attributeName === 'data-ft' && mutation.target.dataset.fte && mutation.oldValue.startsWith('{')) {
      processPost(mutation.target, mutation.oldValue);
    }
  });
});

observer.observe(document.body, {
  attributeOldValue: true,
  attributes: true,
  childList: true,
  subtree: true
});

chrome.extension.sendMessage({}, () => {
  const readyStateCheckInterval = setInterval(() => {
    if (document.readyState === 'complete') {
      clearInterval(readyStateCheckInterval);
      injectUI();
      bindEvents();
    }
  }, 10);
});

let tabsEl = {};

// nocontrol-attached-fbtype-266
// nocontrol-attached-psn-EntStatusCreationStory
// nocontrol-attached-psn-EntWallPostCreationStory
// nocontrol-attached-role-1
// nocontrol-attached-role-16
// nocontrol-attached-sl-5
// nocontrol-attached-storyname-EntStatusCreationStory
// nocontrol-fbtype-1
// nocontrol-fbtype-22
// nocontrol-fbtype-32
// nocontrol-fbtype-266
// nocontrol-fbtype-657
// nocontrol-is-page
// nocontrol-is-personal
// nocontrol-post
// nocontrol-psn-EntCommentNodeBasedEdgeStory
// nocontrol-psn-EntEventCreationStory
// nocontrol-psn-EntPhotoUploadBatchNodeBasedEdgeStory
// nocontrol-psn-EntShareCreationStory
// nocontrol-psn-EntSingleUserShareAggregatedStory
// nocontrol-psn-EntStatusCreationStory
// nocontrol-psn-EntVideoCreationStory
// nocontrol-role-1
// nocontrol-role-4
// nocontrol-role-5
// nocontrol-role-16
// nocontrol-storyname-EntEventCreationStory
// nocontrol-storyname-EntPhotoUploadBatchNodeBasedEdgeStory
// nocontrol-storyname-EntShareCreationStory
// nocontrol-storyname-EntSingleUserShareAggregatedStory
// nocontrol-storyname-EntStatusCreationStory
// nocontrol-storyname-EntVideoCreationStory
const tabsMarkup = html`
<div id="nocontrol-tabs" data-referrer="nocontrol-tabs">
  <ul>
    <li>
      <a data-nocontrol-remove="show-*">Everything</a>
    </li>
    <li>
      <a data-nocontrol-add="show-is-personal">Personal</a>
    </li>
    <li>
      <a data-nocontrol-add="show-is-page">Pages</a>
    </li>
  </ul>
  <ul>
    <li>
      <a data-nocontrol-add="show-storyname-EntEventCreationStory">Event</a>
    </li>
    <li>
      <a data-nocontrol-add="show-storyname-EntPhotoUploadBatchNodeBasedEdgeStory">Photo</a>
    </li>
    <li>
      <a data-nocontrol-add="show-storyname-EntShareCreationStory">Share</a>
    </li>
    <li>
      <a data-nocontrol-add="show-storyname-EntSingleUserShareAggregatedStory">Aggregated</a>
    </li>
    <li>
      <a data-nocontrol-add="show-storyname-EntStatusCreationStory">Status</a>
    </li>
    <li>
      <a data-nocontrol-add="show-storyname-EntVideoCreationStory">Video</a>
    </li>
    <li>
      <a data-nocontrol-add="show-storyname-Other">Other</a>
    </li>
  </ul>
</div>
`;

function injectUI() {
  // Place tabs
  document.querySelector('#pagelet_composer, #PageComposerPagelet_').insertAdjacentHTML('afterend', tabsMarkup());
  tabsEl = document.getElementById('nocontrol-tabs');

  // Stories already on the page at load don't have any metadata
  document.querySelectorAll('[data-fte]').forEach(el => {
    el.classList.add('nocontrol-post', 'nocontrol-post-static');
  });

  // Watch for new posts that get added to page, and add our data to them
  const observer2 = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      // Check the json data encoded in the data-ft attribute... before it gets removed
      if (mutation.attributeName === 'data-ft' && mutation.target.dataset.fte && mutation.oldValue.startsWith('{')) {
        processPost(mutation.target, mutation.oldValue);
      }
    });
  });

  observer2.observe(document.body, {
    attributeFilter: ['data-ft'],
    attributeOldValue: true,
    attributes: true,
    childList: true,
    subtree: true
  });
}

function bindEvents() {
  // Tab bar underline
  tabsEl.addEventListener('click', e => {
    const button = e.target;
    tabsEl.querySelectorAll('.nocontrol-tab-active').forEach(el => {
      el.classList.remove('nocontrol-tab-active');
    });
    button.classList.add('nocontrol-tab-active');
  });

  // Show or hide posts based on buttons clicked
  tabsEl.addEventListener('click', e => {
    const button = e.target;

    // Add a class to the body
    // data-nocontrol-add="className"
    if (button.dataset.nocontrolAdd) {
      document.body.classList.add(`nocontrol-${button.dataset.nocontrolAdd}`);
    }

    // Remove a class from the body
    // data-nocontrol-remove="className"
    if (button.dataset.nocontrolRemove) {
      document.body.classList.remove(`nocontrol-${button.dataset.nocontrolRemove}`);
    }
  });
}

function processPost(el, metaData) {
  if (el.dataset.nocontrolProcessed) {
    return;
  }

  let post;
  try {
    post = JSON.parse(metaData);
  } catch (ex) {
    window.logException(ex);
  }

  el.dataset.nocontrolProcessed = true;
  el.classList.add(...classesForPost(post));
}

// const ccc = {};

function classesForPost(post) {
  let classList = [];
  const prefix = 'nocontrol';

  classList.push(`${prefix}-post`);

  if (post.page_id && post.page_insights) {
    classList.push(`${prefix}-is-page`);
    const page = post.page_insights[post.page_id];
    classList = classList.concat(classesForPage(page, prefix));
    if (page.attached_story) {
      classList = classList.concat(classesForPage(page.attached_story, `${prefix}-attached`));
    }
  } else {
    classList.push(`${prefix}-is-personal`);
  }

  // classList.forEach(className => {
  //   ccc[className] = 1;
  // });
  // console.log(ccc);

  return classList;
}

function classesForPage(page, prefix) {
  const classList = [];

  classList.push(`${prefix}-psn-${page.psn}`);
  classList.push(`${prefix}-role-${page.role}`);

  if (page.post_context) {
    classList.push(`${prefix}-storyname-${page.post_context.story_name}`);
    classList.push(`${prefix}-fbtype-${page.post_context.object_fbtype}`);
  }

  return classList;
}

// Usage:
// var templateFn = html`Hello ${"foo"}!`;
// templateFn({ foo: "World" }); // "Hello World!"
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

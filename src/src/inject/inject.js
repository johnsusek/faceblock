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

const tabs = `
<div id="nocontrol-tabs" data-referrer="nocontrol-tabs">
  <ul>
    <li>
      <a data-nocontrol-show="link">Links</a>
    </li>
    <li>
      <a data-nocontrol-show="event">Events</a>
    </li>
    <li>
      <a data-nocontrol-show="other">Other</a>
    </li>
  </ul>
</div>
`;

const categories = ['link', 'event', 'other'];
const storySelector = '[data-fte]';

function injectUI() {
  document.getElementById('pagelet_composer').insertAdjacentHTML('afterend', tabs);
  tabsEl = document.getElementById('nocontrol-tabs');

  // Process stories already on the page at load
  document.querySelectorAll(storySelector).forEach(processStory);

  // Watch for new posts that get added to page, and add our data to them
  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      // Save the data about the post to the story, for parsing later
      // (Facebook removes this from the DOM after they parse it, so we save it here)
      if (mutation.attributeName === 'data-ft') {
        mutation.target.setAttribute('data-nocontrol-postdata', mutation.oldValue);
      }
      // If a story got added, process it
      mutation.addedNodes.forEach(addedNode => {
        if (!addedNode.querySelectorAll) {
          return;
        }
        addedNode.querySelectorAll(storySelector).forEach(processStory);
      });
    });
  });
  observer.observe(document.body, {
    attributeFilter: ['data-ft'],
    attributeOldValue: true,
    attributes: true,
    childList: true,
    subtree: true
  });
}

function bindEvents() {
  tabsEl.addEventListener('click', e => {
    if (e.target.dataset.nocontrolShow) {
      // First, hide everything
      categories.forEach(category => {
        document.body.classList.remove('nocontrol-filtering', `nocontrol-show-${category}`);
      });
      // Then, just show the category we chose
      document.body.classList.add('nocontrol-filtering', `nocontrol-show-${e.target.dataset.nocontrolShow}`);
    }
  });
}

function processStory(story) {
  if (!story.classList || story.dataset.nocontrol_processed) {
    return;
  }

  story.dataset.nocontrol_processed = true;

  if (storyContainsExternalLink(story)) {
    console.log('Story contains an external link! Making it red.', story);
    story.classList.add('nocontrol-type', 'nocontrol-type-link');
    story.dataset.nocontrolType = 'link';
  } else if (storyContainsEvent(story)) {
    console.log('Story contains an event, turning it blue...', story);
    story.classList.add('nocontrol-type', 'nocontrol-type-event');
    story.dataset.nocontrolType = 'event';
  } else {
    story.classList.add('nocontrol-type', 'nocontrol-type-other');
    story.dataset.nocontrolType = 'other';
  }
}

function storyContainsExternalLink(story) {
  if (story.querySelectorAll('a[rel="nofollow"]').length) {
    return true;
  }
}

function storyContainsEvent(story) {
  if (story.querySelectorAll('a[href^="/events"]').length) {
    return true;
  }
  return false;
}

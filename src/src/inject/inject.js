chrome.extension.sendMessage({}, () => {
  const readyStateCheckInterval = setInterval(() => {
    if (document.readyState === 'complete') {
      clearInterval(readyStateCheckInterval);
      injectUI();
    }
  }, 10);
});

let tabsEl = {};

const tabs = `
<div id="nocontrol-tabs" data-referrer="nocontrol-tabs">
  <ul>
    <li>
      <a data-nocontrol-show="links">Links</a>
    </li>
    <li>
      <a data-nocontrol-show="events">Events</a>
    </li>
    <li>
      <a data-nocontrol-show="other">Other</a>
    </li>
  </ul>
</div>
`;

function injectUI() {
  document.getElementById('pagelet_composer').insertAdjacentHTML('afterend', tabs);
  tabsEl = document.getElementById('nocontrol-tabs');

  const selectors = '[data-fte]';
  document.querySelectorAll(selectors).forEach(processStory);

  // Watch for new tweets that get added to page, and add our UI to them
  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(addedNode => {
        if (!addedNode.querySelectorAll) {
          return;
        }
        addedNode.querySelectorAll(selectors).forEach(processStory);
      });
    });
  });
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  tabsEl.addEventListener('click', e => {
    if (e.target.dataset.nocontrolShow) {
      console.log(e.target.dataset.nocontrolShow);
    }
  });
}

function processStory(story) {
  if (story.dataset && story.dataset.ft) {
    console.log(JSON.parse(story.dataset.ft));
  }

  if (!story.classList) {
    return;
  }

  if (story.dataset.nocontrol_processed) {
    return;
  }

  story.dataset.nocontrol_processed = true;

  if (storyContainsExternalLink(story)) {
    console.log('Story contains an external link! Making it red.', story);
    story.classList.add('nocontrol-type-link');
    story.dataset.nocontrolType = 'link';
  } else if (storyContainsEvent(story)) {
    console.log('Story contains an event, turning it blue...', story);
    story.classList.add('nocontrol-type-event');
    story.dataset.nocontrolType = 'event';
  } else {
    if (story.dataset) {
      console.log(story);
      console.log(story.dataset);
    }
    // console.log('Other kind of story...', story);
    // story.classList.add('nocontrol-type-other');
    // story.dataset.nocontrolType = 'other';
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

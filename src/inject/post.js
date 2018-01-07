chrome.extension.sendMessage({}, () => {
  const interactiveCheckInterval = setInterval(() => {
    if (document.readyState === 'interactive') {
      clearInterval(interactiveCheckInterval);
      watchForPosts(document.body);
    }
  }, 10);
});

function watchForPosts(el) {
  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      if (mutation.attributeName === 'data-ft' && mutation.target.dataset.fte && mutation.oldValue.startsWith('{')) {
        processPost(mutation.target, mutation.oldValue);
      }
    });
  });

  observer.observe(el, {
    attributeFilter: ['data-ft'],
    attributeOldValue: true,
    attributes: true,
    childList: true,
    subtree: true
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

  setTimeout(() => {
    el.classList.add('hint--top');
    el.setAttribute('data-hint', JSON.stringify(post, null, 2));
  }, 1000);
  el.classList.add(...classesForPost(post));
  el.dataset.nocontrolProcessed = true;
}

function classesForPost(post) {
  let classList = [];
  const prefix = 'nocontrol';

  classList.push(`${prefix}-post`);

  if (post.page_id && post.page_insights) {
    classList.push(`${prefix}-is-page`);
    if (post.is_sponsored) {
      classList.push(`${prefix}-is-sponsored`);
    }
    const page = post.page_insights[post.page_id];
    classList = classList.concat(classesForPage(page, prefix));
    if (page.attached_story) {
      classList.push(`${prefix}-has-attachment`);
      classList = classList.concat(classesForPage(page.attached_story, `${prefix}-attached`));
    }
  } else {
    classList.push(`${prefix}-is-personal`);
  }

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

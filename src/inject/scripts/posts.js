window.posts = {};
window.currentFilter = 'all';
window.showIsSponsored = true;
window.filterResult = [];

let postCreateObserver = new MutationObserver(mutations => {
  mutations.forEach(mutation => {
    if (
      mutation.target.dataset &&
      mutation.target.dataset.dedupekey &&
      mutation.oldValue &&
      mutation.oldValue.startsWith('{')
    ) {
      let post = {
        id: mutation.target.dataset.dedupekey,
        elId: mutation.target.id,
        elMeta: Object.assign({}, mutation.target.dataset),
        meta: JSON.parse(mutation.oldValue),
        text: mutation.target.innerText
      };
      // Just for debugging, save the data to title attribute
      mutation.target.title = JSON.stringify(post.meta, null, 2);
      // Put into our list of posts for later filtering
      window.posts[mutation.target.dataset.dedupekey] = post;
      // Hide/show depending on any filters currently applied
      window.hidePostOnFilterCriteria(post);

      if (window.filterResult.length) {
        console.log('Show post?', post, window.chooseToHideOrShowPostBasedOnFilterResults(post, window.filterResult));
      }
    }
  });
});

postCreateObserver.observe(document, {
  attributeFilter: ['data-ft'],
  attributeOldValue: true,
  attributes: true,
  subtree: true
});

let postUpdateObserver = new MutationObserver(mutations => {
  mutations.forEach(mutation => {
    if (
      mutation.target.dataset &&
      mutation.target.dataset.dedupekey &&
      window.posts[mutation.target.dataset.dedupekey]
    ) {
      window.posts[mutation.target.dataset.dedupekey].text = mutation.target.innerText;
    }
  });
});

postUpdateObserver.observe(document, {
  subtree: true,
  childList: true
});

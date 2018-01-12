window.posts = {};
window.currentFilter = 'all';
window.showIsSponsored = true;

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
      window.posts[mutation.target.dataset.dedupekey] = post;
      // Hide/show depending on any filters currently applied
      window.hidePostOnFilterCriteria(post);
    }
  });
});

observer.observe(document, {
  attributeFilter: ['data-ft'],
  attributeOldValue: true,
  attributes: true,
  subtree: true
});

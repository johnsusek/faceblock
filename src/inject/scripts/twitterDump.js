// Watch DOM for new posts
new MutationObserver(mutations => {
  mutations.forEach(mutation => {
    let el = mutation.target;
    console.log(el.dataset);
  });
}).observe(document, {
  attributeFilter: ['data-ft'],
  attributeOldValue: true,
  attributes: true,
  childList: true,
  subtree: true
});

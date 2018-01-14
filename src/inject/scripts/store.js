window.store = {
  currentFilterPath: '', // a jmespath like "[? ( elId == '123' ) ]", set by ui components
  allPosts: {} // all the posts current on the page, set in watchPosts.js
  // onUpdate: fn - called by anything that updates the store, this gets set in filteredFeed
};

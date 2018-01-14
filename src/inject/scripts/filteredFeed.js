window.store.onUpdate = function() {
  if (this.currentFilterPath) {
    redrawFeed(this.currentFilterPath, this.allPosts);
  } else {
    redrawFeed('[]', this.allPosts);
  }
};

function redrawFeed(currentFilterPath, allPosts) {
  document.querySelector('[role="feed"]').style.display = 'none';

  Object.values(allPosts).forEach(post => {
    if (jmespath.search([post], currentFilterPath).length) {
      document.getElementById(post.elId).style.display = 'block';
    } else {
      document.getElementById(post.elId).style.display = 'none';
    }
  });

  document.querySelector('[role="feed"]').style.display = 'block';
}

// window.hidePostOnFilterCriteria = function(post) {
//   console.log('Applying filter', window.currentFilter);

//   // Tabs
//   if (!window.currentFilter) {
//     document.getElementById(post.elId).style.display = 'block';
//   } else if (!filters[window.currentFilter]) {
//     console.error('Could not find filter for', window.currentFilter);
//   } else if (filters[window.currentFilter](post)) {
//     document.getElementById(post.elId).style.display = 'block';
//   } else {
//     document.getElementById(post.elId).style.display = 'none';
//   }

//   // Toggles
//   if (!window.showIsSponsored && post.meta.is_sponsored) {
//     document.getElementById(post.elId).style.display = 'none';
//   }
// };

// let filters = {
//   all() {
//     return true;
//   },
//   hasPageInsights(post) {
//     let meta = post.meta;
//     if (meta.page_insights && meta.page_insights[meta.page_id]) {
//       return true;
//     }
//   },
//   isFriend(post) {
//     return !post.meta.page_insights;
//   },
//   isPage(post) {
//     return post.meta.page_insights;
//   },
//   isGroup(post) {
//     let meta = post.meta;

//     if (!filters.hasPageInsights(post)) {
//       return false;
//     }
//     if (meta.page_insights[meta.page_id].psn && meta.page_insights[meta.page_id].psn.startsWith('EntGroup')) {
//       return true;
//     }
//     if (
//       meta.page_insights[meta.page_id].post_context &&
//       meta.page_insights[meta.page_id].post_context.story_name &&
//       meta.page_insights[meta.page_id].post_context.story_name.startsWith('EntGroup')
//     ) {
//       return true;
//     }
//     return false;
//   },
//   isSponsored(post) {
//     return post.meta.is_sponsored;
//   }
// };

window.hidePostOnFilterCriteria = function(post) {
  console.log('Deciding to hide post or not', post);
  // Tabs
  if (!window.currentFilter) {
    document.getElementById(post.elId).style.display = 'block';
  } else if (!filters[window.currentFilter]) {
    console.error('Could not find filter for', window.currentFilter);
  } else if (filters[window.currentFilter](post)) {
    document.getElementById(post.elId).style.display = 'block';
  } else {
    document.getElementById(post.elId).style.display = 'none';
  }
  // Toggles
  if (!window.showIsSponsored && post.meta.is_sponsored) {
    document.getElementById(post.elId).style.display = 'none';
  }
};

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

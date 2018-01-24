/* <filter-watcher></filter-watcher> */

let toggles = {
  twitter: {
    videos: '[? !hasVideo ]',
    photos: '[? !hasPhoto ]',
    gifs: '[? !hasGif ]',
    external_links: '[? !hasExternalLinks ]',
    quoted_tweets: '[? !hasQuotedTweets ]'
  },
  facebook: {
    suggested: '[? meta.is_sponsored == null ]',
    shared_post: "[? links_to_post == null && !contains(text, 'shared') ]",
    external_links: '[? external_links == null ]',
    your_memories: '[? meta.throwback_promotion_id == null ]',
    friend_commented_on: "[? meta.page_insight.psn != 'EntCommentNodeBasedEdgeStory' ]",
    pages:
      "[? meta.page_insight.role != `1` || (meta.page_insight.role == `1` && meta.page_insight.post_context.object_fbtype == `657`) ] | [? dataset.story_category != '4' ]"
  }
};

// This watches all the filters in the state, and builds currentFilterPath whenever they change
// filtered-feed then watches currentFilterPath and redraws when it changes
Vue.component('filter-watcher', {
  template: '<div></div>',
  store: {
    filters: CURRENT_NETWORK + '.filters',
    currentFilterPath: CURRENT_NETWORK + '.currentFilterPath'
  },
  computed: {
    combinedFilter() {
      let filterPath = '[]';

      // Find all the checked filters, join their filter values with pipes
      let togglesPath = jpath
        .search(this.filters.toggles, '[? checked ].value')
        .map(t => toggles[CURRENT_NETWORK][t])
        .join(' | ');

      if (togglesPath) {
        filterPath += ' | ' + togglesPath;
      }

      this.filters.keywords &&
        this.filters.keywords.forEach(keyword => {
          if (!keyword) return;
          filterPath += ` | [? contains(text, '${keyword}') == \`false\` ]`;
        });

      this.filters.blocklists.subscriptions &&
        this.filters.blocklists.subscriptions.forEach(subscription => {
          if (!subscription) return;
          subscription.keywords.forEach(keyword => {
            if (!keyword) return;
            filterPath += ` | [? contains(text, '${keyword}') == \`false\` ]`;
          });
        });

      this.filters.hashtags &&
        this.filters.hashtags.forEach(hashtag => {
          if (!hashtag) return;
          filterPath += ` | [? contains(text, '${hashtag}') == \`false\` ]`;
        });

      this.filters.mentions &&
        this.filters.mentions.forEach(mention => {
          if (!mention) return;
          filterPath += ` | [? contains(text, '${mention}') == \`false\` ]`;
        });

      if (this.filters.manualPath) {
        filterPath += ' | ' + this.filters.manualPath;
      }

      return filterPath;
    }
  },
  watch: {
    combinedFilter() {
      this.currentFilterPath = this.combinedFilter;
    }
  }
});

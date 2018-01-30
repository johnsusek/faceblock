let toggleValues = {
  facebook: {
    suggested: '[? meta.is_sponsored == null ]',
    shared_post: "[? !(links_to_post && contains(text, 'shared')) ]",
    external_links: '[? external_links == null ]',
    your_memories: '[? meta.throwback_promotion_id == null ]',
    friend_commented_on: "[? meta.page_insight.psn != 'EntCommentNodeBasedEdgeStory' && !friend_commented_on ]",
    pages: `
          [? meta.page_insight.role != \`1\` && meta.page_insight.role != \`16\` ] | 
          [? dataset.story_category != \`4\` ]
        `
  },
  twitter: {
    videos: '[? !hasVideo ]',
    photos: '[? !hasPhoto ]',
    gifs: '[? !hasGif ]',
    external_links: '[? !hasExternalLinks ]',
    quoted_tweets: '[? !hasQuotedTweets ]',
    retweets: '[? dataset.retweetId == `null` ]',
    liked: '[? dataset.componentContext == `null` ]'
  }
};

var filtersStore = {
  state: {
    facebook: {
      keywords: [],
      toggles: {},
      manualPath: ''
    },
    twitter: {
      keywords: [],
      hashtags: [],
      mentions: [],
      toggles: {},
      manualPath: ''
    }
  },
  getters: {
    pathFromFilters: (state, getters, rootState) => {
      let filters = state[rootState.currentNetwork];
      let path = '[]';

      // Toggles
      let togglesPath = Object.entries(filters.toggles)
        .filter(t => t[1] == true)
        .map(f => f[0])
        .map(t => toggleValues[rootState.currentNetwork][t])
        .join(' | ');

      if (togglesPath) {
        path += ' | ' + togglesPath;
      }

      // Keywords
      filters.keywords.forEach(keyword => {
        path += ` | [? !contains(text, '${keyword}') ]`;
      });

      // Subscriptions
      getters.subscribed.forEach(subscription => {
        if (!subscription) return;
        subscription.keywords.forEach(keyword => {
          if (!keyword) return;
          path += ` | [? !contains(text, '${keyword}') ]`;
        });
      });

      // #Hashtags
      filters.hashtags &&
        filters.hashtags.forEach(hashtag => {
          path += ` | [? !contains(text, '${hashtag}') ]`;
        });

      // @Mentions
      filters.mentions &&
        filters.mentions.forEach(mention => {
          path += ` | [? !contains(text, '${mention}') ]`;
        });

      // Manual path
      if (filters.manualPath) {
        path += ' | ' + filters.manualPath;
      }

      console.log(path);
      return path;
    }
  },
  mutations: {
    HASHTAG_ADD(state, { hashtag, network }) {
      state[network].hashtags.push(hashtag);
    },
    HASHTAG_REMOVE(state, { hashtag, network }) {
      state[network].hashtags = state[network].hashtags.filter(h => h !== hashtag);
    },
    MENTION_ADD(state, { mention, network }) {
      state[network].mentions.push(mention);
    },
    MENTION_REMOVE(state, { mention, network }) {
      state[network].mentions = state[network].mentions.filter(m => m !== mention);
    },
    FILTER_TOGGLE(state, { filter, network }) {
      Vue.set(state[network].toggles, filter, !state[network].toggles[filter]);
    },
    KEYWORD_ADD(state, { keyword, network }) {
      let value = keyword && keyword.trim();
      if (!value || value.length < 3) {
        return;
      }
      state[network].keywords.push(value);
    },
    KEYWORD_REMOVE(state, { keyword, network }) {
      Vue.set(state[network], 'keywords', state[network].keywords.filter(k => k !== keyword));
    },
    MANUAL_PATH_SET(state, { path, network }) {
      state[network].manualPath = path;
    }
  }
};

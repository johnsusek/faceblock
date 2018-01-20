window.store = {
  state: {
    version: 1,
    filters: {
      visible: true,
      sidebar: {
        hideTrending: false,
        hideSponsored: false
      }
    },
    currentFilterPath: '[]',
    manualPath: '',
    toggles: [
      {
        value: 'suggested',
        label: 'Suggested',
        checked: false,
        filter: '[? meta.is_sponsored == null]'
      },
      {
        value: 'shared_post',
        label: 'Shared post',
        checked: false,
        filter: '[? links_to_post == null ]'
      },
      {
        value: 'external_links',
        label: 'External links',
        checked: false,
        filter: '[? external_links == null ]'
      },
      {
        value: 'your_memories',
        label: 'Your memories',
        checked: false,
        filter: '[? meta.throwback_promotion_id == null ]'
      },
      {
        value: 'friend_commented_on',
        label: '‘…commented on this’',
        checked: false,
        filter:
          "[? meta.page_insight.psn != 'EntCommentNodeBasedEdgeStory' ] | [? contains(text, 'commented on this') == `false`]"
      },
      {
        value: 'pages',
        label: 'Pages',
        checked: false,
        filter: "[? meta.page_insight == null] | [? dataset.story_category != '4' ]"
      }
    ],
    keywords: [],
    blocklists: {
      subscriptions: [],
      lists: [
        {
          value: 'us_politics',
          label: 'US Politics',
          url: 'https://feedblock.declaredintent.com/blocklists/us_politics.json',
          fetchDate: 0,
          keywords: []
        }
      ]
    }
  },
  fetchSubscription(list) {
    return window
      .getJSON(list.url)
      .then(json => {
        list.fetchDate = +new Date();
        if (json.version === 1) {
          Vue.set(list, 'keywords', json.payload.keywords);
        } else {
          console.log('unknown version number for subscription, bailing', list.url);
        }
      })
      .catch(ex => {
        window.logException(ex);
      });
  },
  refreshSubscriptions(subscriptions) {
    subscriptions.forEach(subscription => {
      if (!subscription) return;
      const DURATION_2_DAYS = 172800;
      if (+new Date() - subscription.fetchDate > DURATION_2_DAYS) {
        window.store.fetchSubscription(subscription);
      }
    });
  }
};

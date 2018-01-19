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
        value: 'pages',
        label: 'Pages',
        checked: false,
        filter: '[? meta.page_insight == null]'
      },
      {
        value: 'your_memories',
        label: 'Your memories',
        checked: false,
        filter: '[? meta.throwback_promotion_id == null ]'
      },
      {
        value: 'external_links',
        label: 'External links',
        checked: false,
        filter: '[? external_links == null ]'
      },
      {
        value: 'friend_commented_on',
        label: '‘Friend commented on’',
        checked: false,
        filter: ''
      },
      {
        value: 'shared_post',
        label: 'Shared post',
        checked: false,
        filter: ''
      },
      {
        value: 'has_attachment',
        label: 'Has attachment',
        checked: false,
        filter: ''
      }
    ],
    keywords: [],
    blocklists: {
      subscriptions: [],
      lists: [
        {
          value: 'us_politics',
          label: 'US Politics',
          url: 'https://faceblock.declaredintent.com/blocklists/us_politics.json',
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

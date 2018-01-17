window.store = {
  state: {
    filters: {
      visible: false
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
        console.log('There was an error fetching subscription', list.url);
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

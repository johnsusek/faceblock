window.store = {
  state: {
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
          url: 'https://download.declaredintent.com/faceblock/us_politics.json',
          fetchDate: 0,
          keywords: []
        }
      ]
    }
  },
  fetchSubscription(list) {
    // Fetch the list and put into our state
    return fetch(list.url)
      .then(res => {
        res.json().then(json => {
          // TODO: upon startup, check this date and refresh the list if > 2 days old
          list.fetchDate = +new Date();
          if (json.version === 1) {
            Vue.set(list, 'keywords', json.payload.keywords);
          } else {
            console.log('unknown version number for subscription, bailing', list.url);
          }
        });
      })
      .catch(() => {
        console.log('There was an error fetching subscription', list.url);
      });
  }
};

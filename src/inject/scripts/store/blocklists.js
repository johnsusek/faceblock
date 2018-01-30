var blocklistsStore = {
  state: {
    facebook: {
      usPolitics: {
        name: 'usPolitics',
        label: 'US Politics',
        url: 'https://feedblock.declaredintent.com/blocklists/us_politics.json',
        fetchDate: 0,
        keywords: [],
        subscribed: false
      }
    },
    twitter: {
      usPolitics: {
        name: 'usPolitics',
        label: 'US Politics',
        url: 'https://feedblock.declaredintent.com/blocklists/us_politics.json',
        fetchDate: 0,
        keywords: [],
        subscribed: false
      }
    }
  },
  mutations: {
    SUBSCRIPTION_ADD(state, { name, network }) {
      state[network][name].subscribed = true;
    },
    SUBSCRIPTION_REMOVE(state, { name, network }) {
      state[network][name].subscribed = false;
    },
    SUBSCRIPTION_UPDATE(state, { name, fetchDate, keywords, network }) {
      let blocklist = state[network][name];
      blocklist.fetchDate = fetchDate;
      blocklist.keywords = keywords;
    }
  },
  actions: {
    SUBSCRIPTION_FETCH: function({ commit, state }, { name, network }) {
      let blocklist = state[network][name];
      return window.getJSON(blocklist.url).then(json => {
        if (json.payload && json.payload.keywords) {
          commit('SUBSCRIPTION_UPDATE', { name, network, fetchDate: +new Date(), keywords: json.payload.keywords });
        }
      });
    },
    SUBSCRIPTION_REFRESH(state, { subscribed, network }) {
      subscribed.forEach(subscription => {
        const DURATION_2_DAYS = 1;
        if (+new Date() - subscription.fetchDate > DURATION_2_DAYS) {
          store.dispatch('SUBSCRIPTION_FETCH', { name: subscription.name, network });
        }
      });
    }
  },
  getters: {
    unsubscribed: (state, getters, rootState) => {
      return Object.entries(state[rootState.currentNetwork])
        .filter(l => !l[1].subscribed)
        .map(l => l[1]);
    },
    subscribed: (state, getters, rootState) => {
      return Object.entries(state[rootState.currentNetwork])
        .filter(l => l[1].subscribed)
        .map(l => l[1]);
    }
  }
};

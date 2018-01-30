var store = new Vuex.Store({
  modules: {
    filters: filtersStore,
    blocklists: blocklistsStore,
    sidebar: sidebarStore
  },
  state: {
    version: 4,
    currentNetwork: '',
    facebook: {
      visible: true
    },
    twitter: {
      visible: true
    }
  },
  mutations: {
    CURRENT_NETWORK_SET(state, network) {
      state.currentNetwork = network;
    },
    VISIBILITY_TOGGLE(state, network) {
      state[state.currentNetwork].visible = !state[state.currentNetwork].visible;
    }
  }
});

if (localStorage.getItem('feedblock_store')) {
  let savedState = JSON.parse(localStorage.getItem('feedblock_store'));
  let mergedState = deepmerge(store.state, savedState);
  // In the future, run migrations between versions here
  store.replaceState(mergedState);
}

store.subscribe((mutation, state) => {
  console.log(mutation);
  localStorage.setItem('feedblock_store', JSON.stringify(state));
});

var sidebarStore = {
  state: {
    facebook: {
      hideTrending: false,
      hideSponsored: false,
      hideStories: false
    },
    twitter: {
      hideFooter: false,
      hideTrending: false,
      hideWTF: false,
      hideLiveVideo: false
    }
  },
  mutations: {
    SIDEBAR_TOGGLE(state, { name, network }) {
      state[network][name] = !state[network][name];
      store.commit('SIDEBAR_REFRESH', network);
    },
    SIDEBAR_REFRESH(state, network) {
      let sidebar = state[network];

      // Direct DOM manipulation here because this stuff is outside of the Vue app
      if (sidebar.hideFooter) {
        document.body.classList.add('feedblock_hide_footer');
      } else {
        document.body.classList.remove('feedblock_hide_footer');
      }
      if (sidebar.hideTrending) {
        document.body.classList.add('feedblock_hide_trending');
      } else {
        document.body.classList.remove('feedblock_hide_trending');
      }
      if (sidebar.hideWTF) {
        document.body.classList.add('feedblock_hide_wtf');
      } else {
        document.body.classList.remove('feedblock_hide_wtf');
      }
      if (sidebar.hideLiveVideo) {
        document.body.classList.add('feedblock_hide_livevideo');
      } else {
        document.body.classList.remove('feedblock_hide_livevideo');
      }
      if (sidebar.hideSponsored) {
        document.body.classList.add('feedblock_hide_sponsored');
      } else {
        document.body.classList.remove('feedblock_hide_sponsored');
      }
      if (sidebar.hideStories) {
        document.body.classList.add('feedblock_hide_stories');
      } else {
        document.body.classList.remove('feedblock_hide_stories');
      }
    }
  }
};

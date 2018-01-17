let app = new Vue({
  template: html`
    <div id="faceblock">
      <h4 @click="store.filters.visible = !store.filters.visible">
        <span>FaceBlock</span>
        <a>
          <span v-show="store.filters.visible">Hide</span>
          <span v-show="!store.filters.visible">Show</span>
        </a>
      </h4>
      <filters></filters>
      <filtered-feed></filtered-feed>
    </div>
  `(),
  data: {
    store: window.store.state
  },
  watch: {
    store: {
      handler() {
        this.stateFreeze();
      },
      deep: true
    }
  },
  created() {
    let savedState = this.stateThaw();
    if (savedState) {
      this.store = savedState;
    }
    this.store.blocklists.subscriptions.forEach(subscription => {
      if (!subscription) return;
      const DURATION_2_DAYS = 172800;
      if (+new Date() - subscription.fetchDate > DURATION_2_DAYS) {
        // It's been longer than two days, refresh the list
        window.store.fetchSubscription(subscription);
      }
    });
  },
  methods: {
    toggleFilters() {
      console.log('toggling filters');
      this.store.filters.visible = !this.store.filters.visible;
    },
    stateFreeze() {
      if (this.store) {
        // console.log('Freezing state', JSON.stringify(this.store));
        localStorage.setItem('nocontrol_state', JSON.stringify(this.store));
      }
    },
    stateThaw() {
      // console.log('Thawing state', localStorage.getItem('nocontrol_state'));
      if (localStorage.getItem('nocontrol_state')) {
        return JSON.parse(localStorage.getItem('nocontrol_state') || '{}');
      }
    }
  }
});

let faceblockCheckInterval = setInterval(() => {
  if (document.querySelector('#universalNav')) {
    clearInterval(faceblockCheckInterval);
    document.querySelector('#universalNav').insertAdjacentHTML('afterEnd', '<div id="faceblock-inject"></div>');
    app.$mount('#faceblock-inject');
  }
}, 10);

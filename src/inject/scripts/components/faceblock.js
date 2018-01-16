let app = new Vue({
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
      const DURATION_2_DAYS = 172800;
      if (+new Date() - subscription.fetchDate > DURATION_2_DAYS) {
        // It's been longer than two days, refresh the list
        window.store.fetchSubscription(subscription);
      }
    });
  },
  methods: {
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

let appMarkup = html`
  <div id="faceblock">
    <h4 class="navHeader">
      <span class="sectionDragHandle">FaceBlock</span>
    </h4>
    <filters></filters>
    <filtered-feed></filtered-feed>
  </div>
`;

let faceblockCheckInterval = setInterval(() => {
  if (document.querySelector('#universalNav')) {
    clearInterval(faceblockCheckInterval);
    document.querySelector('#universalNav').insertAdjacentHTML('afterEnd', appMarkup());
    app.$mount('#faceblock');
  }
}, 10);

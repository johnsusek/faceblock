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
  // computed: {
  //   currentFilterPath() {
  //     // If there is a manual
  //     if (this.currentFilterPath2) {
  //     }
  //     // TODO: If keywords, append those to filter
  //     }
  //   }
  // },
  created() {
    let savedState = this.stateThaw();
    if (savedState) {
      this.store = savedState;
    }
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

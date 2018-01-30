Vue.component('filter-sidebar', {
  template: html`
    <section id="feedblock-sidebar">
      <h5 title="Check a box to block display of that section in the this.sidebar.">Block sidebar</h5>
      <ul>
        <li v-for="option in options[network]">
          <label>
            <input 
              type="checkbox" 
              :checked="sidebar[option.value]" 
              :value="option.value" 
              @change="toggleSidebarFilter"> 
            {{ option.label }}
          </label>      
        </li>
      </ul>
    </section>`(),

  props: ['network'],

  computed: {
    sidebar() {
      return this.$store.state.sidebar[this.network];
    }
  },

  data() {
    return {
      options: {
        twitter: [
          {
            value: 'hideFooter',
            label: 'Footer'
          },
          {
            value: 'hideTrending',
            label: 'Trending'
          },
          {
            value: 'hideWTF',
            label: 'Who to follow'
          },
          {
            value: 'hideLiveVideo',
            label: 'Live video'
          }
        ],
        facebook: [
          {
            value: 'hideTrending',
            label: 'Trending'
          },
          {
            value: 'hideSponsored',
            label: 'Suggested'
          },
          {
            value: 'hideStories',
            label: 'Stories'
          },
          {
            value: 'hideFooter',
            label: 'Footer'
          }
        ]
      }
    };
  },

  created() {
    store.commit('SIDEBAR_REFRESH', this.network);
  },

  methods: {
    toggleSidebarFilter(ev) {
      store.commit('SIDEBAR_TOGGLE', { name: ev.target.value, network: this.network });
    }
  }
});

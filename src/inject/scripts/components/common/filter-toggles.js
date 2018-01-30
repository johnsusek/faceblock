Vue.component('filter-toggles', {
  template: html`
    <section id="filter-toggles">
      <h5 title="Check a box to block posts of that type.">Block categories</h5>
      <ul>
        <li v-for="option in options[network]">
          <label>
            <input 
              type="checkbox" 
              :checked="toggles[option.value]" 
              :value="option.value" 
              @change="toggleFilter"> 
            {{ option.label }}
          </label>
        </li>
      </ul>
    </section>
  `(),

  props: ['network'],

  computed: {
    toggles() {
      return this.$store.state.filters[this.network].toggles;
    }
  },

  data() {
    return {
      options: {
        twitter: [
          {
            value: 'videos',
            label: 'Videos'
          },
          {
            value: 'photos',
            label: 'Photos'
          },
          {
            value: 'gifs',
            label: 'GIFs'
          },
          {
            value: 'external_links',
            label: 'External links'
          },
          {
            value: 'quoted_tweets',
            label: 'Quoted tweets'
          },
          {
            value: 'retweets',
            label: 'Retweets'
          },
          {
            value: 'liked',
            label: 'Liked'
          }
        ],
        facebook: [
          {
            value: 'suggested',
            label: 'Suggested'
          },
          {
            value: 'shared_post',
            label: 'Shared post'
          },
          {
            value: 'external_links',
            label: 'External links'
          },
          {
            value: 'your_memories',
            label: 'Your memories'
          },
          {
            value: 'friend_commented_on',
            label: '‘…commented on this’'
          },
          {
            value: 'pages',
            label: 'Page posts'
          }
        ]
      }
    };
  },

  methods: {
    toggleFilter(ev) {
      store.commit('FILTER_TOGGLE', { filter: ev.target.value, network: this.network });
    }
  }
});

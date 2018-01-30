Vue.component('filter-hashtags', {
  template: html`
    <section id="feedblock-hashtags">
      <h5 
        v-bind:class="{ 'has-hashtags': hashtags.length }"
        @click="showList = !showList" 
        title="Include #hashtags to be blocked. Press Enter to add.">
        Blocked hashtags 
        <span v-show="hashtags.length">({{ hashtags.length }})</span>
      </h5>
      <ul v-show="showList" class="autocomplete-list">
        <li v-for="hashtag in hashtags">
          <span>{{ hashtag }}</span>
          <a @click="removeHashtag(hashtag)" class="delete">x</a>
        </li>
      </ul>
      <autocomplete-twitter v-on:selectionChoose="addHashtag" prefix="#" resultType="hashtags" resultKey="hashtag"></autocomplete-twitter>
    </section>
  `(),

  props: ['network'],

  computed: {
    hashtags() {
      return this.$store.state.filters[this.network].hashtags;
    }
  },

  data() {
    return {
      showList: false
    };
  },

  methods: {
    addHashtag(value) {
      if (!value) {
        return;
      }
      if (!value.startsWith('#')) {
        value = '#' + value;
      }
      store.commit('HASHTAG_ADD', { hashtag: value, network: this.network });
    },
    removeHashtag(value) {
      store.commit('HASHTAG_REMOVE', { hashtag: value, network: this.network });
    }
  }
});

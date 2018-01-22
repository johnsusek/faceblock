// TODO remove "in case you missed it":
// js-stream-item stream-item has-recap js-no-dedup DismissibleModule js-has-navigable-stream stream-item separated-module
// TimelineTweetsModule

/* <filter-hashtags> */

Vue.component('filter-hashtags', {
  template: html`
    <section id="feedblock-hashtags">
      <h5 
        v-bind:class="{ 'has-hashtags': hashtags.length }"
        @click="showList = !showList" 
        title="">
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
  store: {
    hashtags: 'twitter.filters.hashtags'
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
      this.hashtags.push(value);
    },
    removeHashtag(hashtag) {
      this.hashtags = this.hashtags.filter(k => k !== hashtag);
      if (!this.hashtags.length) {
        this.showList = false;
      }
    }
  }
});

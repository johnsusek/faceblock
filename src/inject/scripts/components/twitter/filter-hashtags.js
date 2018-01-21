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
      <ul v-show="showList">
        <li v-for="keyword in hashtags">
          <span>{{ keyword }}</span>
          <a @click="removeKeyword(keyword)" class="delete">x</a>
        </li>
      </ul>
      <div>
        <input type="text" v-model="newHashtag" @keyup.enter="addKeyword">
        <button @click="addKeyword">Add</button>
      </div>
    </section>
  `(),
  store: {
    hashtags: 'twitter.filters.hashtags'
  },
  data() {
    return {
      newHashtag: '',
      showList: false
    };
  },
  methods: {
    addKeyword() {
      let value = this.newHashtag && this.newHashtag.trim();
      if (!value || value.length < 3) {
        return;
      }
      if (!value.startsWith('#')) {
        value = '#' + value;
      }
      this.hashtags.push(value);
      this.newHashtag = '';
    },
    removeKeyword(keyword) {
      this.hashtags = this.hashtags.filter(k => k !== keyword);
      if (!this.hashtags.length) {
        this.showList = false;
      }
    }
  }
});

Vue.component('filter-keywords', {
  template: html`
    <section id="feedblock-keywords">
      <h5 
        v-bind:class="{ 'has-keywords': keywords.length }"
        @click="showList = !showList" 
        title="Input a word or phrase and click the 'Add' button to begin blocking all posts that contain that word or phrase. Case sensitive. Click to toggle the visibility of the list of blockwords.">
        Blockwords 
        <span v-show="keywords.length">({{ keywords.length }})</span>
      </h5>
      <ul v-show="showList">
        <li v-for="keyword in keywords">
          <span>{{ keyword }}</span>
          <a @click="removeKeyword(keyword)" class="delete">x</a>
        </li>
      </ul>
      <div>
        <input type="text" v-model="newKeyword" @keyup.enter="addKeyword">
        <button @click="addKeyword">Add</button>
      </div>
    </section>
  `(),
  props: ['network'],
  computed: {
    keywords() {
      return this.$store.state.filters[this.network].keywords;
    }
  },
  data() {
    return {
      newKeyword: '',
      showList: false
    };
  },
  methods: {
    addKeyword() {
      store.commit('KEYWORD_ADD', { keyword: this.newKeyword, network: this.network });
      this.newKeyword = '';
    },
    removeKeyword(keyword) {
      store.commit('KEYWORD_REMOVE', { keyword, network: this.network });
    }
  }
});

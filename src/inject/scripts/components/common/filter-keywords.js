/* <filter-keywords> */

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
  store: {
    keywords: CURRENT_NETWORK + '.filters.keywords'
  },
  data() {
    return {
      newKeyword: '',
      showList: false
    };
  },
  methods: {
    addKeyword() {
      let value = this.newKeyword && this.newKeyword.trim();
      if (!value || value.length < 3) {
        return;
      }
      this.keywords.push(value);
      this.newKeyword = '';
    },
    removeKeyword(keyword) {
      this.keywords = this.keywords.filter(k => k !== keyword);
      if (!this.keywords.length) {
        this.showList = false;
      }
    }
  }
});

/* <filter-keywords> */

Vue.component('filter-keywords', {
  template: html`
    <section id="feedblock-keywords">
      <h5 title="Input a word or phrase and click the 'Add' button to begin blocking all posts that contain that word or phrase. Case sensitive.">Blockwords</h5>
      <ul>
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
    keywords: 'filters.keywords'
  },
  data() {
    return {
      newKeyword: ''
    };
  },
  methods: {
    addKeyword() {
      let value = this.newKeyword && this.newKeyword.trim();
      if (!value || value.length < 3) {
        return;
      }
      this.keywords.push(value);
      console.log(this.keywords);
      this.newKeyword = '';
    },
    removeKeyword(keyword) {
      this.keywords = this.keywords.filter(k => k !== keyword);
    }
  }
});

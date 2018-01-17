/* <filter-keywords> */

Vue.component('filter-keywords', {
  template: html`
    <section id="faceblock-keywords">
      <h5>Blockwords</h5>
      <ul>
        <li v-for="keyword in keywords">
          <span>{{ keyword }}</span>
          <a @click="removeKeyword(keyword)">x</a>
        </li>
      </ul>
      <div>
        <input type="text" v-model="newKeyword" @keyup.enter="addKeyword">
        <button @click="addKeyword">Add</button>
      </div>
    </section>
  `(),
  store: ['keywords'],
  data() {
    return {
      newKeyword: ''
    };
  },
  methods: {
    addKeyword() {
      let value = this.newKeyword && this.newKeyword.trim();
      if (!value) {
        return;
      }
      this.keywords.push(value);
      this.newKeyword = '';
    },
    removeKeyword(keyword) {
      this.keywords = this.keywords.filter(k => k !== keyword);
    }
  }
});

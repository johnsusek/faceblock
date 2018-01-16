/* <filter-keywords> */

Vue.component('filter-keywords', {
  template: html`
    <div id="faceblock-keywords">
      <ul>
        <li v-for="keyword in keywords.list">
          <span>{{ keyword }}</span>
          <a @click="removeKeyword(keyword)">x</a>
        </li>
      </ul>          
      <div>
        <input type="text" v-model="newKeyword" @keyup.enter="addKeyword">
        <button @click="addKeyword">Add</button>
      </div>
    </div>
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
      this.keywords.list.push(value);
      this.newKeyword = '';
    },
    removeKeyword(keyword) {
      this.keywords.list = this.keywords.list.filter(k => k !== keyword);
    }
  }
});

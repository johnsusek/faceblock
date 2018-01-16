/* <filters></filters> */

Vue.component('filters', {
  template: html`
    <div id="faceblock-filters">
      Combined filter: {{ combinedFilter }} <br>
      <filter-toggles></filter-toggles> <br>
      <filter-manual></filter-manual> <br>
      <button @click="applyToFeed">Apply</button>
    </div>
  `(),
  store: ['currentFilterPath', 'keywords', 'manualPath', 'toggles'],
  computed: {
    combinedFilter() {
      let filterPath = '[]';

      let togglesPath = jpath.search(this.toggles, '[?checked].filter').join(' | ');
      if (togglesPath) {
        filterPath += ' | ' + togglesPath;
      }

      let keywordsPath = '';

      this.keywords.list.forEach(keyword => {
        if (!keyword) {
          return;
        }
        keywordsPath += ` | [? contains(text, '${keyword}') == \`true\`) ]`;
      });

      if (keywordsPath) {
        filterPath += keywordsPath;
      }

      if (this.manualPath) {
        filterPath += ' | ' + this.manualPath;
      }

      return filterPath;
    }
  },
  methods: {
    applyToFeed() {
      console.log('Apply path to this.currentFilterPath', this.combinedFilter);
      this.currentFilterPath = this.combinedFilter;
    }
  }
});

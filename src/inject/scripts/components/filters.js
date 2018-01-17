/* <filters></filters> */

Vue.component('filters', {
  template: html`
    <div id="faceblock-filters" v-show="filters.visible">
      <filter-toggles></filter-toggles> 
      <filter-keywords></filter-keywords> 
      <filter-blocklists></filter-blocklists> 
    </div>
  `(),
  store: ['filters', 'blocklists', 'currentFilterPath', 'keywords', 'manualPath', 'toggles'],
  computed: {
    combinedFilter() {
      let filterPath = '[]';

      let togglesPath = jpath.search(this.toggles, '[?checked].filter').join(' | ');
      if (togglesPath) {
        filterPath += ' | ' + togglesPath;
      }

      let keywordsPath = '';

      this.keywords.forEach(keyword => {
        if (!keyword) {
          return;
        }
        keywordsPath += ` | [? contains(text, '${keyword}') == \`false\` ]`;
      });

      if (keywordsPath) {
        filterPath += keywordsPath;
      }

      let blocklistKeywordsPath = '';

      this.blocklists.subscriptions.forEach(subscription => {
        if (!subscription) return;
        subscription.keywords.forEach(keyword => {
          if (!keyword) {
            return;
          }
          blocklistKeywordsPath += ` | [? contains(text, '${keyword}') == \`false\` ]`;
        });
      });

      if (blocklistKeywordsPath) {
        filterPath += blocklistKeywordsPath;
      }

      if (this.manualPath) {
        filterPath += ' | ' + this.manualPath;
      }

      return filterPath;
    }
  },
  watch: {
    combinedFilter() {
      console.log('Setting currentFilterpath to...', this.combinedFilter);
      this.currentFilterPath = this.combinedFilter;
    }
  }
});

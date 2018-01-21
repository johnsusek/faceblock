/* <filters></filters> */

Vue.component('filters', {
  template: html`
    <div id="feedblock-filters" v-show="filters.visible">
      <filter-keywords></filter-keywords> 
      <filter-blocklists></filter-blocklists> 
      <filter-toggles></filter-toggles> 
      <filter-sidebar></filter-sidebar> 
    </div>
  `(),
  store: ['filters', 'currentFilterPath'],
  computed: {
    combinedFilter() {
      let filterPath = '[]';

      let togglesPath = jpath.search(this.filters.toggles, '[?checked].filter').join(' | ');
      if (togglesPath) {
        filterPath += ' | ' + togglesPath;
      }

      let keywordsPath = '';

      this.filters.keywords.forEach(keyword => {
        if (!keyword) {
          return;
        }
        keywordsPath += ` | [? contains(text, '${keyword}') == \`false\` ]`;
      });

      if (keywordsPath) {
        filterPath += keywordsPath;
      }

      let blocklistKeywordsPath = '';

      this.filters.blocklists.subscriptions.forEach(subscription => {
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

      if (this.filters.manualPath) {
        filterPath += ' | ' + this.filters.manualPath;
      }

      DEBUG && console.log('filterPath', filterPath);
      return filterPath;
    }
  },
  watch: {
    combinedFilter() {
      this.currentFilterPath = this.combinedFilter;
    }
  }
});

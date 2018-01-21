/* <filter-watcher></filter-watcher> */

// This watches all the filters in the state, and builds currentFilterPath whenever they change
// filtered-feed then watches currentFilterPath and redraws when it changes
Vue.component('filter-watcher', {
  template: '<div></div>',
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

      return filterPath;
    }
  },
  watch: {
    combinedFilter() {
      this.currentFilterPath = this.combinedFilter;
    }
  }
});

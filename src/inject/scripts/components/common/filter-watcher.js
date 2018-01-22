/* <filter-watcher></filter-watcher> */

// This watches all the filters in the state, and builds currentFilterPath whenever they change
// filtered-feed then watches currentFilterPath and redraws when it changes
Vue.component('filter-watcher', {
  template: '<div></div>',
  store: {
    filters: CURRENT_NETWORK + '.filters',
    currentFilterPath: CURRENT_NETWORK + '.currentFilterPath'
  },
  computed: {
    combinedFilter() {
      let filterPath = '[]';

      let togglesPath = jpath.search(this.filters.toggles, '[?checked].filter').join(' | ');
      if (togglesPath) {
        filterPath += ' | ' + togglesPath;
      }

      this.filters.keywords &&
        this.filters.keywords.forEach(keyword => {
          if (!keyword) return;
          filterPath += ` | [? contains(text, '${keyword}') == \`false\` ]`;
        });

      this.filters.blocklists.subscriptions &&
        this.filters.blocklists.subscriptions.forEach(subscription => {
          if (!subscription) return;
          subscription.keywords.forEach(keyword => {
            if (!keyword) return;
            filterPath += ` | [? contains(text, '${keyword}') == \`false\` ]`;
          });
        });

      this.filters.hashtags &&
        this.filters.hashtags.forEach(hashtag => {
          if (!hashtag) return;
          filterPath += ` | [? contains(text, '${hashtag}') == \`false\` ]`;
        });

      this.filters.mentions &&
        this.filters.mentions.forEach(mention => {
          if (!mention) return;
          filterPath += ` | [? contains(text, '${mention}') == \`false\` ]`;
        });

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

/* <filters></filters> */

Vue.component('filters', {
  template: html`
    <div id="faceblock-filters">
      <filter-toggles></filter-toggles> 
      <filter-keywords></filter-keywords> 
      <filter-manual></filter-manual> 
      <filter-blocklists></filter-blocklists> 
      {{ combinedFilter }} 
    </div>
  `(),
  store: ['blocklists', 'currentFilterPath', 'keywords', 'manualPath', 'toggles'],
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

      console.log('Setting currentFilterpath to', filterPath);
      this.currentFilterPath = filterPath;

      return filterPath;
    }
  }
});

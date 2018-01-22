/* <filters></filters> */

Vue.component('filters', {
  template: html`
    <div id="feedblock-filters" v-show="filters.visible">
      <filter-keywords></filter-keywords> 
      <filter-hashtags></filter-hashtags> 
      <filter-mentions></filter-mentions> 
      <filter-blocklists></filter-blocklists> 
      <filter-toggles></filter-toggles> 
      <filter-sidebar></filter-sidebar> 
      <filter-watcher></filter-watcher>
      <filtered-feed></filtered-feed>
    </div>
  `(),
  store: {
    filters: 'twitter.filters'
  }
});

/* <filtered-feed> */

Vue.component('filtered-feed', {
  template: html`
    <div id="feedblock-feed"></div>
  `(),
  store: ['currentFilterPath'],
  data() {
    return {
      allPosts: {}
    };
  },
  watch: {
    // We have to redraw manually because the twitter feed
    // is not actually a Vue component :)
    allPosts() {
      console.log('allPosts updated..redrawing feed');
      if (!this.allPosts) {
        return;
      }
      this.redrawFeed();
    },
    currentFilterPath() {
      console.log('currentFilterPath updated to ', this.currentFilterPath);
      if (!this.currentFilterPath) {
        return;
      }
      this.redrawFeed();
    }
  },
  created() {
    window.allPosts = window.allPosts || {};

    // Watch DOM for new tweets
    new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.target.id === 'stream-items-id') {
          mutation.target.querySelectorAll('[data-tweet-id]').forEach(el => {
            let tweet = {
              itemId: el.dataset.itemId,
              classList: Array.from(el.classList),
              dataset: Object.assign({}, el.dataset),
              text: el.querySelector('.tweet-text') && el.querySelector('.tweet-text').innerText
            };
            Vue.set(this.allPosts, tweet.dataset.tweetId, tweet);
            // This seemed to be required during the fb #fallback_feed shenanigans,
            // so those posts wouldn't flash in for a moment
            // but not on twitter feed. commenting out for now
            // this.redrawFeed();
          });
        }
      });
    }).observe(document, {
      childList: true,
      subtree: true
    });
  },
  methods: {
    redrawFeed() {
      console.log('Redrawing feed using filter', this.currentFilterPath);

      // Loop through this.allPosts, which should have gotten built up from
      // the mutation observers, so we can check if each post passes
      // the current filter, and show or hide it.
      Object.values(this.allPosts).forEach(post => {
        let postEl = document.querySelector(`[data-item-id="${post.itemId}"]`);
        if (!postEl) {
          return;
        }
        const result = jpath.search([post], this.currentFilterPath);

        if (result && result.length) {
          // jpath returned the post, so it passed the filter - show it
          postEl.style.display = 'block';
        } else {
          postEl.style.display = 'none';
        }
      });
    }
  }
});

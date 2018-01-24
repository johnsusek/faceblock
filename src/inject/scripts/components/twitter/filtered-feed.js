/* <filtered-feed> */

Vue.component('filtered-feed', {
  template: html`
    <div id="feedblock-feed"></div>
  `(),
  store: {
    currentFilterPath: 'twitter.currentFilterPath'
  },
  data() {
    return {
      allTweets: {}
    };
  },
  watch: {
    allTweets() {
      if (!this.allTweets) {
        return;
      }
      this.redrawFeed();
    },
    currentFilterPath() {
      if (!this.currentFilterPath) {
        return;
      }
      this.redrawFeed();
    }
  },
  created() {
    // Watch DOM for new tweets
    new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.target.id === 'stream-items-id') {
          mutation.target.querySelectorAll('[data-tweet-id]').forEach(el => {
            Vue.set(this.allTweets, el.dataset.tweetId, tweetFromEl(el));
            this.redrawFeed();
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
      // Loop through this.allTweets, which should have gotten built up from
      // the mutation observers, so we can check if each tweet passes
      // the current filter, and show or hide it.
      Object.values(this.allTweets).forEach(tweet => {
        let tweetEl = document.querySelector(`.tweet[data-item-id="${tweet.itemId}"]`);
        if (!tweetEl) {
          return;
        }
        const result = jpath.search([tweet], this.currentFilterPath);

        if (result && result.length) {
          // jpath returned the tweet, so it passed the filter - show it
          tweetEl.style.display = 'block';
        } else {
          tweetEl.style.display = 'none';
        }
      });
    }
  }
});

function tweetFromEl(el) {
  let externalLinks = [...el.querySelectorAll('[data-expanded-url]')]
    .filter(a => {
      let url = new URL(a.dataset.expandedUrl);
      if (!url.hostname.endsWith('twitter.com')) {
        return a;
      }
    })
    .map(a => {
      return a.dataset.expandedUrl;
    });

  let tweet = {
    itemId: el.dataset.itemId,
    classList: Array.from(el.classList),
    dataset: Object.assign({}, el.dataset),
    hashtags: [...el.querySelectorAll('.tweet-text .twitter-hashtag')].map(hashtag => {
      return hashtag.innerText;
    }),
    mentions: [...el.querySelectorAll('.tweet-text .twitter-atreply')].map(hashtag => {
      return hashtag.innerText;
    }),
    hasQuotedTweets: !!el.querySelector('.QuoteTweet-container'),
    hasGif: !!el.querySelector('.PlayableMedia--gif'),
    hasVideo: !!el.querySelector('.PlayableMedia--video'),
    hasPhoto: !!el.querySelector('.AdaptiveMedia-photoContainer'),
    externalLinks,
    hasExternalLinks: !!externalLinks.length,
    text: el.innerText,
    tweetText: el.querySelector('.tweet-text') && el.querySelector('.tweet-text').innerText
  };

  return tweet;
}

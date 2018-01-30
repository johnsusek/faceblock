Vue.component('filtered-feed', {
  template: html`
    <div id="feedblock-feed"></div>
  `(),

  computed: {
    pathFromFilters: () => store.getters.pathFromFilters
  },

  data() {
    return {
      allTweets: {}
    };
  },

  watch: {
    allTweets() {
      console.log('New tweets have arrived.');
      if (!this.allTweets) {
        return;
      }
      this.redrawFeed();
    },
    pathFromFilters() {
      console.log('The filters have changed.');
      if (!this.pathFromFilters) {
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
            console.log('Added tweet to database.', el.dataset.tweetId);
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
      // Loop through each stream item (which may contain multiple tweets for convos)
      let streamItemEls = document.querySelectorAll('#timeline #stream-items-id .stream-item');

      streamItemEls.forEach(streamItemEl => {
        let blockStreamItem = false;

        // Loop through each tweet in the stream item
        streamItemEl.querySelectorAll('.tweet').forEach(tweetEl => {
          const tweet = this.allTweets[tweetEl.dataset.tweetId];
          if (!tweet) {
            // Tweet is on the page, but not in our database yet.. hmm..
            return;
          }
          const result = jpath.search([tweet], this.pathFromFilters);

          // If this tweet should be blocked, hide the stream item
          if (!result || !result.length) {
            blockStreamItem = true;
          }
        });

        if (blockStreamItem) {
          streamItemEl.style.display = 'none';
        } else {
          streamItemEl.style.display = 'block';
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
    tweetId: el.dataset.tweetId,
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

  el.dataset.feedblockDebug = JSON.stringify(tweet, null, 2);

  return tweet;
}

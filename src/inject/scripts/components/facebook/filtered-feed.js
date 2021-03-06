Vue.component('filtered-feed', {
  template: html`
    <div id="feedblock-feed"></div>
  `(),

  computed: {
    pathFromFilters: () => store.getters.pathFromFilters
  },

  data() {
    return {
      allPosts: {}
    };
  },

  watch: {
    // For when new posts come in, automatically do a redraw in case they
    // should be hidden
    allPosts() {
      console.log('New posts have arrived.');
      // console.log('allPosts was modified, updating feed!');
      if (!this.allPosts) {
        return;
      }
      this.redrawFeed();
    },
    // For when the filters change
    pathFromFilters() {
      console.log('The filters have changed.');
      // console.log(this.pathFromFilters);
      this.redrawFeed();
    }
  },

  created() {
    // Watch DOM for new posts
    new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        let el = mutation.target;
        let meta = mutation.oldValue;
        let dedupekey = Math.floor(Math.random() * Math.floor(Number.MAX_SAFE_INTEGER));
        if (el.dataset && el.dataset.dedupekey) {
          dedupekey = el.dataset.dedupekey;
        }
        Vue.set(this.allPosts, dedupekey, createPostFromEl(el, meta));
        this.redrawFeed();
      });
    }).observe(document, {
      attributeFilter: ['data-ft'],
      attributeOldValue: true,
      attributes: true,
      subtree: true
    });

    // Watch DOM for updated posts
    new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        let el = mutation.target;
        if (el.dataset && el.dataset.dedupekey) {
          // A post el has been mutated, probably the content ajaxed in,
          // so lets update this.allPosts[] with new information
          let dedupekey = el.dataset.dedupekey;
          let post = this.allPosts[dedupekey];

          if (!post) return;

          // add the new information
          post = updatePostFromEl(post, el);

          // update our debugging tooltip
          el.setAttribute('rel', JSON.stringify(post, null, 2));

          Vue.set(this.allPosts, dedupekey, post);
          this.redrawFeed();
        }
      });
    }).observe(document, {
      subtree: true,
      childList: true
    });
  },

  methods: {
    redrawFeed() {
      // feed - for homepage
      // capsule_container - for profile pages
      let feedSelector = '[role="feed"], #recent_capsule_container';

      if (!document.querySelector(feedSelector)) {
        return;
      }

      if (!this.pathFromFilters) {
        this.pathFromFilters = '[]';
      }

      // console.log('Redrawing feed using filter', this.pathFromFilters);

      // Optimization: hide the feed before changing stories visibility,
      // to prevent a bunch of reflows. Need to check if this actually
      // helps, and how much.
      document.querySelector(feedSelector).style.display = 'none';

      // Loop through this.allPosts, which should have gotten built up from
      // the mutation observers, so we can check if each post passes
      // the current filter, and show or hide it.
      Object.values(this.allPosts).forEach(post => {
        if (!document.getElementById(post.el)) {
          return;
        }
        const result = jpath.search([post], this.pathFromFilters);
        if (result && result.length) {
          // jpath returned the post, so it passed the filter - show it
          document.getElementById(post.el).style.display = 'block';
        } else {
          document.getElementById(post.el).style.display = 'none';
        }
      });

      document.querySelector(feedSelector).style.display = 'block';
    }
  }
});

function createPostFromEl(el, metaJSON) {
  let post = {
    id: el.dataset.dedupekey,
    el: el.id,
    timestamp: el.dataset.timestamp,
    meta: JSON.parse(metaJSON)
  };

  post = updatePostFromEl(post, el);

  if (post.meta.page_insights && post.meta.page_id) {
    post.meta.page_insight = post.meta.page_insights[post.meta.page_id];
    delete post.meta.page_insights[post.meta.page_id];
  }

  el.dataset.feedblockDebug = JSON.stringify(post, null, 2);

  return post;
}

function updatePostFromEl(post, el) {
  post.profiles = getProfiles(el);
  post.hovercards = getHovercards(el);
  post.text = el.innerText;
  post.external_links = getHasExternalLinks(el);

  // Dataset
  post.dataset = Object.assign({}, el.dataset);

  // Links to post
  el.querySelectorAll('a').forEach(a => {
    if (!a.href || !a.href.startsWith('http')) {
      return;
    }

    let url = new URL(a.href);

    //  /jobloe/posts/1234
    // 01^^^^^^2^^^^^3^^^^
    if (post.meta.top_level_post_id) {
      let parts = url.pathname.split('/');
      // Link to a post, that doesn't link to itself
      if (parts[2] === 'posts' && parts[3] !== post.meta.top_level_post_id) {
        post.links_to_post = true;
      }
    }
  });

  post.friend_commented_on = !![...el.querySelectorAll('h5')].find(a => a.textContent.includes(' commented on this.'));

  if (post.meta.is_sponsored) {
    el.classList.add('is-sponsored');
  }

  return post;
}

function getHasExternalLinks(el) {
  let hasExternalLinks;

  let externalLinks = el.querySelectorAll('a[href^="https://l.facebook.com/l.php"');
  externalLinks.forEach(externalLink => {
    // There is an external (link-shortened) url...
    let url = new URL(externalLink.href);
    let actualUrl = url.searchParams.get('u');
    if (actualUrl && !actualUrl.match(/(jpg|jpeg|gif|png|gifv|mp4)$/)) {
      // ...and it isn't a link to an image/video, so mark the post
      hasExternalLinks = true;
    }
  });

  return hasExternalLinks;
}

function getProfiles(el) {
  let profiles = [];
  el.querySelectorAll('a.profileLink').forEach(a => {
    if (a.innerText && !profiles.includes(a.innerText)) {
      profiles.push(a.innerText);
    }
  });
  return profiles;
}

function getHovercards(el) {
  let hovercards = [];
  el.querySelectorAll('a[data-hovercard]').forEach(a => {
    if (a.innerText && !hovercards.includes(a.innerText)) {
      hovercards.push(a.innerText);
    }
  });
  return hovercards;
}

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
    // We have to redraw manually because the facebook feed
    // is not actually a Vue component :)
    allPosts() {
      if (!this.allPosts) {
        // console.log('allPosts was empty when attempting to redraw the feed');
        return;
      }
      this.redrawFeed();
    },
    currentFilterPath() {
      // console.log('currentFilterPath updated to ', this.currentFilterPath);
      if (!this.currentFilterPath) {
        // console.log('Tried to apply an empty filter path to feed');
        return;
      }
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
      if (!document.querySelector('[role="feed"]')) {
        return;
      }

      // console.log('Redrawing feed using filter', this.currentFilterPath);

      // Optimization: hide the feed before changing stories visibility,
      // to prevent a bunch of reflows. Need to check if this actually
      // helps, and how much.
      document.querySelector('[role="feed"]').style.display = 'none';

      // Loop through this.allPosts, which should have gotten built up from
      // the mutation observers, so we can check if each post passes
      // the current filter, and show or hide it.
      Object.values(this.allPosts).forEach(post => {
        if (!document.getElementById(post.el)) {
          return;
        }
        const result = jpath.search([post], this.currentFilterPath);
        if (result && result.length) {
          // jpath returned the post, so it passed the filter - show it
          document.getElementById(post.el).style.display = 'block';
        } else {
          document.getElementById(post.el).style.display = 'none';
        }
      });

      document.querySelector('[role="feed"]').style.display = 'block';
    }
  }
});

function createPostFromEl(el, metaJSON) {
  // TODO: error checking & data validation
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

  el.setAttribute('rel', JSON.stringify(post, null, 2));
  return post;
}

function updatePostFromEl(post, el) {
  post.profiles = getProfiles(el);
  post.hovercards = getHovercards(el);
  post.text = el.innerText;

  if (el.querySelectorAll('a[href^="https://l.facebook.com/l.php"').length) {
    post.external_links = true;
  }

  post.dataset = Object.assign({}, el.dataset);

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

  return post;
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

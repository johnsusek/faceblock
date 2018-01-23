window.state = {
  version: -1
};

let migrations = [
  state => {
    return {
      twitter: {
        filters: {
          visible: true,
          hashtags: [],
          mentions: [],
          keywords: [],
          blocklists: {
            subscriptions: [],
            lists: [
              {
                value: 'us_politics',
                label: 'US Politics',
                url: 'https://feedblock.declaredintent.com/blocklists/us_politics.json',
                fetchDate: 0,
                keywords: []
              }
            ]
          },
          sidebar: {
            hideFooter: false,
            hideTrending: false,
            hideWTF: false,
            hideLiveVideo: false
          },
          manualPath: ''
        },
        currentFilterPath: '[]'
      },
      facebook: {
        filters: {
          visible: true,
          keywords: [],
          blocklists: {
            subscriptions: [],
            lists: [
              {
                value: 'us_politics',
                label: 'US Politics',
                url: 'https://feedblock.declaredintent.com/blocklists/us_politics.json',
                fetchDate: 0,
                keywords: []
              }
            ]
          },
          toggles: [
            {
              value: 'suggested',
              label: 'Suggested',
              checked: false,
              filter: '[? meta.is_sponsored == null ]'
            },
            {
              value: 'shared_post',
              label: 'Shared post',
              checked: false,
              filter: '[? links_to_post == null ]'
            },
            {
              value: 'external_links',
              label: 'External links',
              checked: false,
              filter: '[? external_links == null ]'
            },
            {
              value: 'your_memories',
              label: 'Your memories',
              checked: false,
              filter: '[? meta.throwback_promotion_id == null ]'
            },
            {
              value: 'friend_commented_on',
              label: '‘…commented on this’',
              checked: false,
              filter:
                "[? meta.page_insight.psn != 'EntCommentNodeBasedEdgeStory' ] | [? contains(text, 'commented on this') == `false`]"
            },
            {
              value: 'pages',
              label: 'Pages',
              checked: false,
              filter: "[? meta.page_insight == null] | [? dataset.story_category != '4' ]"
            }
          ],
          sidebar: {
            hideTrending: false,
            hideSponsored: false
          },
          manualPath: ''
        },
        currentFilterPath: '[]'
      }
    };
  },
  state => {
    state.twitter.filters.toggles = [
      {
        value: 'videos',
        label: 'Videos',
        checked: false,
        filter: '[? !hasVideo ]'
      },
      {
        value: 'photos',
        label: 'Photos',
        checked: false,
        filter: '[? !hasPhoto ]'
      },
      {
        value: 'gifs',
        label: 'GIFs',
        checked: false,
        filter: '[? !hasGif ]'
      },
      {
        value: 'external_links',
        label: 'External links',
        checked: false,
        filter: '[? !hasExternalLinks ]'
      },
      {
        value: 'quoted_tweets',
        label: 'Quoted tweets',
        checked: false,
        filter: '[? !hasQuotedTweets ]'
      }
    ];

    return state;
  },
  state => {
    // Shared post - make it
    state.facebook.filters.toggles[1].filter = "[? links_to_post == null && contains(text, 'shared')]";
    return state;
  }
];

window.runMigrations = function(state) {
  migrations.forEach(function(migration, i) {
    // When a new version of the extension is released, the
    // migrations that haven't run yet will do so,
    // because the migrations array will be longer
    if (i > state.version) {
      state = migration(state);
      // We then save how many we've run to state.version,
      // for doing this check next time
      state.version = i;
    }
  });

  return state;
};

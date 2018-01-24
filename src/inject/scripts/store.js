// Default state gets set here. What is in user's localstorage might reset this,
// so remember, changes to this structure need to be done in code *after thaw*
state = getInitialState();

function getInitialState() {
  return {
    version: 3,
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
              value: 'usPolitics',
              label: 'US Politics',
              fetchDate: 0,
              keywords: []
            }
          ]
        },
        toggles: [
          {
            value: 'videos',
            label: 'Videos',
            checked: false
          },
          {
            value: 'photos',
            label: 'Photos',
            checked: false
          },
          {
            value: 'gifs',
            label: 'GIFs',
            checked: false
          },
          {
            value: 'external_links',
            label: 'External links',
            checked: false
          },
          {
            value: 'quoted_tweets',
            label: 'Quoted tweets',
            checked: false
          }
        ],
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
              value: 'usPolitics',
              label: 'US Politics',
              fetchDate: 0,
              keywords: []
            }
          ]
        },
        toggles: [
          {
            value: 'suggested',
            label: 'Suggested',
            checked: false
          },
          {
            value: 'shared_post',
            label: 'Shared post',
            checked: false
          },
          {
            value: 'external_links',
            label: 'External links',
            checked: false
          },
          {
            value: 'your_memories',
            label: 'Your memories',
            checked: false
          },
          {
            value: 'friend_commented_on',
            label: '‘…commented on this’',
            checked: false
          },
          {
            value: 'pages',
            label: 'Page posts',
            checked: false
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
}

function stateFreeze(stateToFreeze) {
  // Filter out some things we don't want to save to localStorage,
  // like currentFilterPath
  let freezableState = stateFreezable(stateToFreeze);
  localStorage.setItem('feedblock_state', JSON.stringify(freezableState));
}

function stateThaw() {
  let savedState;

  if (localStorage.getItem('feedblock_state')) {
    savedState = JSON.parse(localStorage.getItem('feedblock_state'));
  }

  if (!savedState || (savedState && savedState.version < 3)) {
    // Build initial state if there is nothing saved (new installs)
    // also, reset old versions of state (early betas)
    return getInitialState();
  } else {
    return savedState;
  }
}

function stateFreezable(stateToFreeze) {
  // remove what we don't want to save...
  return stateToFreeze;
}

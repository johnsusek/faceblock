window.store = {
  state: {
    currentFilterPath: '[]',
    manualPath: '',
    toggles: [
      {
        value: 'suggested',
        label: 'Suggested',
        checked: false,
        filter: '[? meta.is_sponsored == null]'
      },
      {
        value: 'pages',
        label: 'Pages',
        checked: false,
        filter: '[? meta.page_insight == null]'
      },
      {
        value: 'groups',
        label: 'Groups',
        checked: false,
        filter: ''
      },
      {
        value: 'external_links',
        label: 'External links',
        checked: false,
        filter: ''
      },
      {
        value: 'friend_commented_on',
        label: "'Friend commented on'",
        checked: false,
        filter: ''
      },
      {
        value: 'video',
        label: 'Video',
        checked: false,
        filter: ''
      },
      {
        value: 'shared_post',
        label: 'Shared post',
        checked: false,
        filter: ''
      },
      {
        value: 'has_attachment',
        label: 'Has attachment',
        checked: false,
        filter: ''
      }
    ],
    keywords: {
      value: 'keywords',
      label: 'Keywords',
      checked: false,
      filter: '',
      list: []
    }
  }
};

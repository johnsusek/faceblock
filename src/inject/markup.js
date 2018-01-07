window.tabsMarkup = html`
<div id="nocontrol-tabs" data-referrer="nocontrol-tabs">
  <h4 class="navHeader">Type</h4>
  <ul>
    <li>
      <a data-nocontrol-add="show-fbtype-266">Default</a>
    </li>
    <li>
      <a data-nocontrol-add="show-fbtype-1">Actionable</a>
    </li>
    <li>
      <a data-nocontrol-add="show-fbtype-22">Photos</a>
    </li>
    <li>
      <a data-nocontrol-add="show-fbtype-32">Link share</a>
    </li>
    <li>
      <a data-nocontrol-add="show-fbtype-657">Added Event</a>
    </li>
  </ul>
  <h4 class="navHeader">Role</h4>
  <ul>
    <li>
      <a data-nocontrol-add="show-role-1">Default</a>
    </li>
    <li>
      <a data-nocontrol-add="show-role-4">Check-in</a>
    </li>
    <li>
      <a data-nocontrol-add="show-role-5">Page check-in</a>
    </li>
    <li>
      <a data-nocontrol-add="show-role-16">Commented on</a>
    </li>
  </ul>
  <h4 class="navHeader">Story</h4>
  <ul>
    <li>
      <a data-nocontrol-add="show-storyname-EntEventCreationStory">Event</a>
    </li>
    <li>
      <a data-nocontrol-add="show-storyname-EntGroupCreationStory">Group</a>
    </li>
    <li>
      <a data-nocontrol-add="show-storyname-EntPhotoUploadBatchNodeBasedEdgeStory">Photo</a>
    </li>
    <li>
      <a data-nocontrol-add="show-storyname-EntShareCreationStory">Share</a>
    </li>
    <li>
      <a data-nocontrol-add="show-storyname-EntSingleUserShareAggregatedStory">Aggregation</a>
    </li>
    <li>
      <a data-nocontrol-add="show-storyname-EntStatusCreationStory">Status</a>
    </li>
    <li>
      <a data-nocontrol-add="show-storyname-EntVideoCreationStory">Video</a>
    </li>
    <li>
      <a data-nocontrol-add="show-storyname-undefined">Other</a>
    </li>
  </ul>
  <h4 class="navHeader">Friend</h4>
  <ul>
    <li>
      <a data-nocontrol-add="show-is-personal">Personal</a>
    </li>
    <li>
      <a data-nocontrol-add="show-is-page">Pages</a>
    </li>
  </ul>
  <h4 class="navHeader">Attachment</h4>
  <ul>
    <li>
      <a data-nocontrol-add="show-has-attachment">Has Attachment</a>
    </li>
  </ul>
  <h4 class="navHeader">Suggested</h4>
  <ul>
    <li>
      <a data-nocontrol-add="show-is-sponsored">Suggested Post</a>
    </li>
  </ul>
  <h4 class="navHeader">Action</h4>
  <ul>
    <li>
      <a data-nocontrol-add="show-psn-EntCommentNodeBasedEdgeStory">Friend commented</a>
    </li>
    <li>
      <a data-nocontrol-add="show-psn-EntEventCreationStory">Event created</a>
    </li>
    <li>
      <a data-nocontrol-add="show-psn-EntGroupCreationStory">Group created</a>
    </li>
    <li>
      <a data-nocontrol-add="show-psn-EntPhotoUploadBatchNodeBasedEdgeStory">Photo uploaded</a>
    </li>
    <li>
      <a data-nocontrol-add="show-psn-EntShareCreationStory">Link share</a>
    </li>
    <li>
      <a data-nocontrol-add="show-psn-EntSingleUserShareAggregatedStory">Aggregated</a>
    </li>
    <li>
      <a data-nocontrol-add="show-psn-EntStatusCreationStory">Status update</a>
    </li>
    <li>
      <a data-nocontrol-add="show-psn-EntVideoCreationStory">Video uploaded</a>
    </li>
    <li>
      <a data-nocontrol-add="show-psn-EntWallPostCreationStory">Wall post</a>
    </li>
  </ul>
</div>
`;

window.pleaseWait = html`
  <div class="nocontrol-wait nocontrol-panel">
    <div class="nocontrol-spinner">
      <div class="nocontrol-bounce1"></div>
      <div class="nocontrol-bounce2"></div>
      <div class="nocontrol-bounce3"></div>
    </div>
    Loading new posts, to see if any match your filter criteria... (TODO: disappear when no more posts found)
  </div>
`;
window.noMore = html`
  <div class="nocontrol-wait nocontrol-panel">
    No more posts found that match your filter criteria.
    <br>
    <br>
    <a href="/">
      Clear all filters
    </a>
</div>
`;

// Usage:
// var templateFn = html`Hello ${"foo"}!`;
// templateFn({ foo: "World" }); // "Hello World!"
function html(strings, ...keys) {
  return function(...values) {
    if (!values) {
      return '';
    }
    const dict = values[values.length - 1] || {};
    const result = [strings[0]];
    keys.forEach((key, i) => {
      const value = Number.isInteger(key) ? values[key] : dict[key];
      result.push(value, strings[i + 1]);
    });
    return result.join('');
  };
}

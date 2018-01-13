let tabsCheckInterval = setInterval(() => {
  if (document.querySelector('[role="feed"]')) {
    clearInterval(tabsCheckInterval);
    injectFilterUI();
  }
}, 10);

let tabsMarkup = window.html`
  <div id="nocontrol-filters">
    <div id="nocontrol-tabs">
      <ul>
        <li>
          <a data-nocontrol-filter="all" class="nocontrol-tab-active">All</a>
        </li>
        <li>
          <a data-nocontrol-filter="isFriend">Friends</a>
        </li>
        <li>
          <a data-nocontrol-filter="isPage">Pages</a>
        </li>
        <li>
          <a data-nocontrol-filter="isGroup">Groups</a>
        </li>
      </ul>
    </div>
    <div id="nocontrol-toggles">
      <label>
        <input type="checkbox" data-nocontrol-and="isSponsored" checked="checked">
        Suggested
      </label>
    </div>
  </div>
`;

function injectFilterUI() {
  // Place tabs
  document.querySelector('[role="feed"]').insertAdjacentHTML('beforeBegin', tabsMarkup());

  // Toggles
  document.getElementById('nocontrol-toggles').addEventListener('change', e => {
    handleToggles(e);
  });

  // Tabs
  document.getElementById('nocontrol-tabs').addEventListener('click', e => {
    document.querySelector('[role="feed"]').style.transition = 'opacity 1s';
    document.querySelector('[role="feed"]').style.opacity = 0.5;
    switchTabs(e);
    setTimeout(() => {
      applyFilter(e);
    }, 10);
  });
}

function handleToggles(e) {
  // Check each toggle, do the proper thing
  let toggle = e.target.querySelector('input') || e.target;
  console.log(toggle.checked);
  if (toggle.checked) {
    window.showIsSponsored = true;
  } else {
    window.showIsSponsored = false;
  }
  applyFiltersToPost(window.currentFilter);
}

function switchTabs(e) {
  let button = e.target;
  button
    .closest('ul')
    .querySelectorAll('.nocontrol-tab-active')
    .forEach(el => {
      el.classList.remove('nocontrol-tab-active');
    });
  button.classList.add('nocontrol-tab-active');
}

function applyFilter(e) {
  let button = e.target;

  if (button.dataset.nocontrolFilter) {
    window.currentFilter = button.dataset.nocontrolFilter;
    applyFiltersToPost(window.currentFilter);
  }
}

function applyFiltersToPost() {
  // hide the feed to prevent reflows
  document.querySelector('[role="feed"]').style.display = 'none';

  // loop through every post on the page
  let postMap = new Map(Object.entries(window.posts));
  postMap.forEach(post => {
    window.hidePostOnFilterCriteria(post);
  });

  // show the feed again now that we've modified it
  document.querySelector('[role="feed"]').style.display = 'block';
  document.querySelector('[role="feed"]').style.opacity = 1;
}

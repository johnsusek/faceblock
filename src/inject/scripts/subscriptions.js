window.fetchSubscription = function(subscription) {
  return window
    .getJSON(subscription.url)
    .then(json => {
      subscription.fetchDate = +new Date();
      if (json.payload && json.payload.keywords) {
        Vue.set(subscription, 'keywords', json.payload.keywords);
      }
    })
    .catch(ex => window.logException(ex));
};

window.refreshSubscriptions = function(subscriptions) {
  subscriptions.forEach(subscription => {
    if (!subscription) return;
    const DURATION_2_DAYS = 172800;
    if (+new Date() - subscription.fetchDate > DURATION_2_DAYS) {
      window.fetchSubscription(subscription);
    }
  });
};

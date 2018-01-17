window.logException = function(ex) {
  const uuid = window.generateUuid();
  const exception = {
    message: ex.toString(),
    stack: ex.stack
  };
  window.logger({ exception }, uuid);
  console.info(`[faceblock] Caught exception ${uuid}. Please include this identifier if reporting a bug.`, exception);
};

window.logError = function(error) {
  const uuid = window.generateUuid();
  window.logger({ error }, uuid);
  console.info(`[faceblock] Caught error ${uuid}. Please include this identifier if reporting a bug.`, error);
};

window.logger = function(payload, uuid = window.generateUuid()) {
  window
    .postJSON('https://log.declaredintent.com/entries', {
      namespace: 'com.declaredintent.faceblock',
      useragent: navigator && navigator.userAgent,
      payload,
      uuid
    })
    .catch(() => {
      console.error('Got error trying to log error, giving up.');
    });
};

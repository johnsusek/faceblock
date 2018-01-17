OffAmazonPayments.Button('AmazonPayButton', 'A2RSC9FWFD9UM4', {
  type: 'hostedPayment',
  hostedParametersProvider: done => {
    let args = {
      amount: '1',
      currencyCode: 'USD',
      sellerNote: 'sellerNote...'
    };
    // Call the back end to combine button args with
    // other seller config param values and sign it.
    window.getJSON('https://faceblock.declaredintent.com/generateAmazonRequestSignature', args).then(data => {
      done(data);
    });
  },
  onError: errorCode => {
    // your error handling code
  }
});

(function(window){
  'use strict';

  let bitcoinField = document.querySelector('.bitcoinfield__input');
  let inrField = document.querySelector('.inrfield__input');
  let urls = ['https://blockchain.info/ticker',
              'http://data.fixer.io/api/latest?access_key=YOUR_API_KEY&symbols=USD,INR'];
  function formSubmitted(event) {
    Promise.all(urls.map(url =>
      fetch(url)
      .then(response => {
        // A fetch() promise will reject with a TypeError when a network error is encountered or CORS is misconfigured on the server-side, although this usually means permission issues or similar — a 404 does not constitute a network error, for example. An accurate check for a successful fetch() would include checking that the promise resolved, then checking that the Response.ok property has a value of true.
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
    )).then(texts => {
      if (isNaN(texts[0].USD.last)) {
        throw new Error('Malformed JSON returned from blockchain.info !');
      }
      if (isNaN(texts[1].rates.INR) || isNaN(texts[1].rates.USD)) {
        throw new Error('Malformed JSON returned from fixer.io !');
      }
      inrField.value = bitcoinField.value * texts[0].USD.last * texts[1].rates.INR / texts[1].rates.USD;
    }).catch(e => {
      console.error(e);
      console.error('Error in fetching from APIs!');
    })
  }
  window.formSubmitted = formSubmitted;
})(window);
